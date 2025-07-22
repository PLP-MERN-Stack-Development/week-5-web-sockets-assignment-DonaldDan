// server/controllers/chatController.js

const { Message } = require('../models');

const messages = [];

function handleSendMessage(io, socket, users, data) {
  const sender = users[socket.id]?.username || 'Anonymous';
  const message = new Message({
    sender,
    senderId: socket.id,
    message: data.message,
    isPrivate: false,
  });

  messages.push(message);
  if (messages.length > 100) messages.shift(); // Memory limit

  io.emit('receive_message', message);
}

function handleTyping(io, socket, typingUsers, isTyping, users) {
  const username = users[socket.id]?.username;
  if (!username) return;

  if (isTyping) {
    typingUsers[socket.id] = username;
  } else {
    delete typingUsers[socket.id];
  }

  io.emit('typing_users', Object.values(typingUsers));
}

function handlePrivateMessage(socket, to, messageContent, users) {
  const sender = users[socket.id]?.username || 'Anonymous';

  const message = new Message({
    sender,
    senderId: socket.id,
    message: messageContent,
    isPrivate: true,
  });

  socket.to(to).emit('private_message', message);
  socket.emit('private_message', message);
}

module.exports = {
  handleSendMessage,
  handleTyping,
  handlePrivateMessage,
  messages, // export for API route
};
