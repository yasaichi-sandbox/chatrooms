import $ from 'jquery';
import SocketIOClient from 'socket.io-client';
import Chat from './chat.js';

$(document).ready(() => {
  const socket = SocketIOClient.connect();
  const chatApp = new Chat(socket);

  socket.on('nameResult', (result) => {
    const message = result.success ?
      `You are known as ${result.name}.` : result.message;

    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', ({room}) => {
    $('#room').text(room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', ({text}) => {
    const $message = $('<div />').text(text);
    $('#messages').append($message);
  });

  socket.on('rooms', (rooms) => {
    const $roomList = $('#room-list');
    $roomList.empty();

    rooms
      .filter(room => room != '')
      .forEach(room => $($roomList).append(divEscapedContentElement(room)));

    $roomList.children('div').click(function() {
      chatApp.processCommand(`/join ${$(this).text()}`);
      $('#send-message').focus();
    });
  });

  setInterval(() => socket.emit('rooms'), 1000);
  $('#send-message').focus();

  $('#send-form').submit(() => {
    processUserInput(chatApp, socket);
    return false;
  });
});

function divEscapedContentElement(message) {
  return $('<div />').text(message)
}

function divSystemContentElement(message) {
  return $('<div />').html(`<i>${message}</i>`)
}

function processUserInput(chatApp, socket) {
  const $input = $('#send-message');
  const $messages = $('#messages');
  const message = $input.val();

  if (message.charAt(0) === '/') {
    const systemMessage = chatApp.processCommand(message);

    if(systemMessage) {
      $messages.append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message);
    $messages.append(divEscapedContentElement(message));
    $messages.scrollTop($messages.prop('scrollHeight'));
  }

  $input.val('');
}