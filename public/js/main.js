const socket = io();

console.log(socket)
socket.on('message', message => {
  console.log(message);
})