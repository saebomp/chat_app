const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //Welcome current user - for single clients
        socket.emit('message', formatMessage('Admin', 'Welcome to ChatCord')); 
        
        //Broadcast when a user connetcs - for all of the clients except the client that's connecting
        socket.broadcast.to(user.room).emit('message', formatMessage('Admin', `${user.username} has joined the chat`)); 

        //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    
    //Runs when client disconnects
    socket.on('disconnect', ()=> {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage('Admin', `${user.username} has left the chat`)) 
        
            //Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
    
    //Listen for chatMessage
    socket.on('chatMessage', msg=> {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
})

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



//npm run dev
// https://www.youtube.com/watch?v=jD7FnbI76Hg  50:48
// https://cdnjs.com/libraries/qs