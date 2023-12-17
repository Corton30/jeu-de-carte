const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3001;

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('user list', Object.values(users));
        io.emit('user joined', `${username} joined the chat`);
    });

    socket.on('chat message', (message) => {
        const user = users[socket.id];
        io.emit('chat message', { user, message });
    });

    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('user list', Object.values(users));
        io.emit('user left', `${username} left the chat`);
    });
});

server.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});