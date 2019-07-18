
/* Chat */
var chat_content = $('ul[class~=chat-content]');
var chat_input = $('input[id~=chat-input]');

$(document).on('click', '#chat-send', function chat_send(event) {
	event.preventDefault();
	if(chat_input.val()[0] === '/') {
    SOCKET.emit('evalServer', chat_input.val().slice(1));
  } else {
    SOCKET.emit('sendMsgToServer', {
			text: chat_input.val(),
		});
  }
	chat_input.val('');
});

SOCKET.on('addToChat', function(data) {
	$('ul[class~=chat-content]')
	.append(
		'<li class="chat-message-zone">'
		+ '<span class="chat-message-zone-zone">' + '[Zone] ' + '</span>'
		+	'<span class="chat-message-zone-name">' + data.username + '</span>: '
		+ '<span class="chat-message-zone-text">' + data.text + '</span>'
		+ '</li>'
	);
});

SOCKET.on('evalAnswer', function(data) {
  console.log(data);
});
/* /Chat */
