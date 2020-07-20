const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");
const Filter = require('bad-words')

const { generateMsg } = require('./utils/messages')

const publicDir = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(publicDir)));

io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on('join', ({ username, room }) => {
        socket.join(room)

        socket.emit("message", generateMsg('Welcome!'));
        socket.broadcast.to(room).emit("message", generateMsg(username + ' has joined'));
    })

    socket.on("sendMsg", (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('Profanity is not allowed.')
        }
        io.emit("updateMsg", generateMsg(msg));
        callback();
    });

    socket.on("sendLocation", ({ lat, long }, callback) => {
        socket.broadcast.emit(
            "locationMessage",
            generateMsg("https://google.com/maps?q=" + lat + "," + long)
        );
        callback()
    });

    socket.on("disconnect", () => {
        io.emit("message", generateMsg("A user has left"));
    });
});

server.listen(port, () => {
    console.log("Server is up on port " + port);
});