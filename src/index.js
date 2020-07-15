const http = require("http");
const path = require("path");
const express = require("express");
const socketio = require("socket.io");

const publicDir = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(publicDir)));

io.on("connection", (socket) => {
   console.log("New WebSocket connection");
   socket.emit("message", "Welcome!");

   socket.on("sendMsg", (msg) => {
      io.emit("updateMsg", msg);
   });
});

server.listen(port, () => {
   console.log("Server is up on port " + port);
});
