// server/models/User.js

class User {
  constructor(socketId, username) {
    this.id = socketId;
    this.username = username;
    this.online = true;
    this.joinedAt = new Date().toISOString();
  }
}

module.exports = User;
