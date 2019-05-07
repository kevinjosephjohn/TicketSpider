const telegram = require('telegram-bot-api'); // Pushing notification to telegram channel.
const request = require('request'); // Making api call to spicinemas.
const twilio = require('twilio'); // Making the phone call for waking me up.
const moment = require('moment'); // Converting date time from the api.

//Twilio Credentials
const accountSid = 'xxxxxxxxxxxxxxx'; // Your Account SID from www.twilio.com/console
const authToken = 'xxxxxxxxxxxxxxxxxxx'; // Your Auth Token from www.twilio.com/console


//Telegram Credentials
var telegramapi = new telegram({
        token: 'XXXXXXXXXX',
        updates: {
  enabled: true
}
});



const movie = "Avengers"; // Movie name to listen.
const phoneNumbers = ["9183585312","948358212","9052585312"]; // Phone numbers to call when the movie is released.
const cinemaName = "Palazzo"; // Cinema to check when the movie is released.
const callFlag = true;

// Check movie status
function checkTickets() {
  var request = require("request");

  var options = {
    method: 'GET',
    url: 'https://www.spicinemas.in/chennai/show-times/data/07-05-2019',
    qs: {
      seats: '2'
    },
    headers: {
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
      authorization: 'Bearer zlPtxMScluDq7yMIUHUCEZx2yMaxAApXCuEm8WdM7p4ic8ejYdmvUc9Bs6iG55o3',
      accept: 'application/json, text/plain, */*'
    }
  };

  request(options, function(error, response, schedule) {
    if (error) throw new Error(error);
    var schedule = JSON.parse(schedule);
    var shows = "=========================\n";
    var showarray = [];
    var screenarray = [];
    Object.keys(schedule.screenSchedules).forEach(function(k) {
      if (schedule.screenSchedules[k].movieName.includes(movie)) {
        var sessionDetails = schedule.screenSchedules[k].sessionDetails;

        Object.keys(sessionDetails).forEach(function(j) {
          var hour = moment(sessionDetails[j].sessionTiming).hour().toString();
          var min = moment(sessionDetails[j].sessionTiming).minute().toString();
          var movietime = hour + ':' + min;

          var eliteTicketCount = parseInt(sessionDetails[j].availability.ELITE);
          var premiumTicketCount = parseInt(sessionDetails[j].availability.PREMIUM);
          if (isNaN(premiumTicketCount)) {
            premiumTicketCount = 0;
          }
          if (eliteTicketCount || premiumTicketCount > 0) {
            shows += sessionDetails[j].parentSessionId + ' - ' + movietime + ' | 🎟️ : ' + sessionDetails[j].availability.ELITE + ' | 🎫 : ' + premiumTicketCount + '\n';
          }
          screenarray.push(sessionDetails[j].parentSessionId);
        });

        showarray.push(schedule.screenSchedules[k].screenName);
      }
    });
    var showarraylength = parseInt(showarray.length);
    var screenarraylength = parseInt(screenarray.length);
    // Number of screens was 35 before avengers was released .
    if (screenarraylength > 35) {

      let stats = 'Cinema Count : ' + showarraylength + ' | Show Count :' + screenarraylength + '\n';
      stats += shows

      sendMessage(XXXXXX, stats);

      makeCall();
    }
    // Number of cinemas was 9 before avengers was released .
    if (showarraylength > 9) {
      let stats = 'Cinema Count : ' + showarraylength + ' | Show Count :' + screenarraylength + '\n';
      stats += shows

      sendMessage(XXXXXX, stats);

      makeCall();
    }

  });
}

// Send message with telegram
/**
 * @param {chatId} str The chat id to send the message to.
 * @param {message} str The message to be sent in the group.
 */
function sendMessage(chatId, message) {
  telegramapi.sendMessage({
      chat_id: chatId,
      parse_mode: 'html',
      text: message,
      disable_notification: true
    })
    .then(function(data) {
      console.log(data);
    });
}

// Make call with twilio
function makeCall() {
  if (flag == true) {
    phoneNumbers.forEach(phoneNumber => {
      client.calls
        .create({
          url: 'http://demo.twilio.com/docs/voice.xml',
          to: phoneNumber,
          from: '+15123374957'
        })
        .then(call => console.log(call.sid),
          reason => {
            console.log(reason); // Error!
          });
    });
    callFlag = false;
  }
}

// Check tickets every 5 seconds
setInterval(checkTickets,5000)
