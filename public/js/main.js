const chatForm = document.getElementById('chat-form');
const socket = io();
const chatMessages = document.querySelector('.chat-messages')

//Message from server
console.log(socket)
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //Scroll down (메세지 있을때 자동으로 스크롤이 밑으로 가게하는거) 
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Message submit
chatForm.addEventListener('submit', (e)=> {
  e.preventDefault();

  //Get message text
  const msg = e.target.elements.msg.value;

  //Emit message to server
  socket.emit('chatMessage', msg);

  //Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})

//Output message to DOM
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}