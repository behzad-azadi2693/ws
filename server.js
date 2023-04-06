const express = require('express');
const socketIo = require('socket.io');
const { createConnection } = require("typeorm");
const structure = require('./structure'); 
const userRouter = require('./src/routes/user');

const app = express();

createConnection()
    .then(() => {
        console.log("Connected to PostgreSQL database");
    })
    .catch((error) => {
        console.log("Error connecting to PostgreSQL database", error);
    });

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.use('/user', userRouter);

const httpServer = app.listen(3000);
const io = socketIo(httpServer, {
    cors : {
        origin : '*'
    }
});

io.on('connection', (socket)=>{
    let nsData = structure.map((namespace)=>{
        return {
            title : namespace.title,
            endpoint : namespace.endpoint
        }
    });

    socket.emit('namespaceLoad', nsData);
});

structure.forEach((namespace)=>{
    io.of(namespace.endpoint).on('connection', (nsSocket)=>{
        
        nsSocket.username = nsSocket.handshake.query.username;
        nsSocket.emit('roomLoad', namespace.rooms);

        nsSocket.on('joinRoom', (roomName)=>{

            let lastRoomName = Array.from(nsSocket.rooms)[1];
            nsSocket.leave(lastRoomName);
            updateOnlineUsers(namespace.endpoint, lastRoomName);

            nsSocket.join(roomName);
            updateOnlineUsers(namespace.endpoint, roomName);

            let roomInfo = namespace.rooms.find((room)=>{ return room.name === roomName });
            nsSocket.emit('roomInformation', roomInfo);

        })

        nsSocket.on('newMessageFromClient', (message)=>{

            let currentRoomName = Array.from(nsSocket.rooms)[1];
            let messageStruct = {
                username : nsSocket.username,
                avatar : 'avatar.png',
                text : message,
                time : new Date().toLocaleString()
            }
            let room = namespace.rooms.find((room)=>{ return room.name === currentRoomName });
            room.addMessage(messageStruct);

            io.of(namespace.endpoint).in(room.name).emit('newMessageFromServer', messageStruct);

        })

        nsSocket.on('disconnecting', ()=>{
            let lastRoomName = Array.from(nsSocket.rooms)[1];
            nsSocket.leave(lastRoomName);
            updateOnlineUsers(namespace.endpoint, lastRoomName);
        })

    })
})

async function updateOnlineUsers(endpoint, roomName){
    let onlineUsers = await io.of(endpoint).in(roomName).allSockets()
    io.of(endpoint).in(roomName).emit('updateOnlineUsers', Array.from(onlineUsers).length);
}