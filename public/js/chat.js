const socket = io();

socket.on("message", (msg) => {
   console.log(msg);
});

const msgForm = document.querySelector("form");

msgForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const msg = e.target.elements.message;

   console.log("Message sent");
   socket.emit("sendMsg", msg.value);
});

socket.on("updateMsg", (msg) => {
   console.log(msg);
});
