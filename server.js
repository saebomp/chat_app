const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
io.on('connection', socket => {

    //Welcome current user - for single clients
    socket.emit('message', formatMessage('Admin', 'Welcome to ChatCord')); 
    
    //Broadcast when a user connetcs - for all of the clients except the client that's connecting
    socket.broadcast.emit('message', formatMessage('Admin', 'A user has joined the chat')); 

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        io.emit('message', formatMessage('Admin', 'A user has left the chat')) 
    })
    
    //Listen for chatMessage
    socket.on('chatMessage', msg=> {
        io.emit('message', formatMessage('User', msg))
    })
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//npm run dev
// https://www.youtube.com/watch?v=jD7FnbI76Hg  27:57