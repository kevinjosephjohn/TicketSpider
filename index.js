function sendMessage(chat_id,message)  {
api.sendMessage({
    chat_id: chat_id,
    parse_mode: 'html',
    text: message,
    disable_notification: true
})
.then(function(data)
{
  console.log(data);
});
}
