const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {MessageObj,MessageLocObj} = require('./utils/message')
const {addUser, removerUser, getUser, getUserInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('Web socket running')

    socket.on('join', ({userName,room}, callback) => {
        const { error, user} = addUser({id: socket.id, userName, room})

        if(error){
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', MessageObj('Admin','Welcome'))
        socket.broadcast.to(user.room).emit('message', MessageObj('Admin',`${user.userName} has joined ${user.room}`))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users: getUserInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('Profanity cannot be used.')
        }
        io.to(user.room).emit('message', MessageObj(user.userName,message))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removerUser(socket.id)

        if(user){
        io.to(user.room).emit('message', MessageObj('Admin',`${user.userName} has left!!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        }
    })

    socket.on('sendLoc', (position,callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('location', MessageLocObj(user.userName,`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })
})




server.listen(port, () => {
    console.log(`server is on port ${port}`)
})