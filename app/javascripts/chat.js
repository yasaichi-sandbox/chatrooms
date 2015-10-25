export default class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(room, text) {
    this.socket.emit('message', {
      room: room,
      text: text
    });
  }

  changeRoom(room) {
    this.socket.emit('join', {
      newRoom: room
    });
  }

  processCommand(command) {
    let message;
    let words = command.split(' ');
    const type = words.shift().substring(1).toLowerCase();

    switch(type) {
      case 'join':
        this.changeRoom(words.join(' '));
        break;
      case 'nick':
        this.socket.emit('nameAttempt', words.join(' '));
        break;
      default:
        message = 'Unrecognized command.';
        break;
    }

    return message;
  }
}