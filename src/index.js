const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { generateMsg, generateNotification } = require('./utils/messages')

const publicDir = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(publicDir)));

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit("message", generateNotification('Welcome!'));
        socket.broadcast.to(user.room).emit("message", generateNotification(user.username + ' has joined!'));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on("sendMsg", (msg, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('No User for the socket')
        }

        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed.')
        }
        io.to(user.room).emit("updateMsg", generateMsg(user.username, msg, socket.id));
        callback();
    });

    socket.on("sendLocation", ({ lat, long }, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback('No User for the socket')
        }

        socket.to(user.room).broadcast.emit(
            "locationMessage",
            generateMsg(user.username, "https://google.com/maps?q=" + lat + "," + long)
        );
        callback()
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit("message", generateNotification(user.username + " has left!"));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    });
});

server.listen(port, () => {
    console.log("Server is up on port " + port);
});