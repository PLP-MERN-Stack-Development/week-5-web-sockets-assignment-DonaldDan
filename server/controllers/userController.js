// server/controllers/userController.js

const { User } = require('../models');

function handleUserJoin(io, socket, users, username) {
  const user = new User(socket.id, username);
  users[socket.id] = user;

  io.emit('user_list', Object.values(users));
  io.emit('user_joined', { username: user.username, id: user.id });

  console.log(`${user.username} joined the chat`);
}

function handleDisconnect(io, socket, users, typingUsers) {
  const username = users[socket.id]?.username;
  if (username) {
    io.emit('user_left', { username, id: socket.id });
    console.log(`${username} left the chat`);
  }

  delete users[socket.id];
  delete typingUsers[socket.id];

  io.emit('user_list', Object.values(users));
  io.emit('typing_users', Object.values(typingUsers));
}

module.exports = {
  handleUserJoin,
  handleDisconnect,
};
