const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
io.on('connection', socket => {

    //Welcome current user
    socket.emit('message', 'Welcome to ChatCord'); 
    //for single clients
    
    //Broadcast when a user connetcs
    socket.broadcast.emit('message', 'A user has joined the chat'); 
    //for all of the clients except the client that's connecting

    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        io.emit('message', 'A user has left the chat') 
    //all the clients
    })
    
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//npm run dev
// https://www.youtube.com/watch?v=jD7FnbI76Hg   17:20