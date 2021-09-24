const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true
})

const socket = io();

//Join chatroom
socket.emit('joinRoom', {username, room})

//Get room and users
socket.on('roomUsers', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users)
})

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

//Add room name to DOM
function outputRoomName(room) { //룸에 들어갔을때 왼쪽에 room name 을 바꿔줌
  roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) { //룸에 들어갔을때 user list 보여줌
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
  `
}