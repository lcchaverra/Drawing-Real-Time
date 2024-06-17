const express = require('express');
const {createServer } = require('http');
const path = require('path');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

var data = []
var users = 0

io.on('connection', socket => {
    console.log('new user connected');

    for (let i = 0; i < data.length; i++) {
        io.emit('show_drawing', data[i])
    }

    users = users + 1
    io.emit('users_counter', users)

    socket.on('delete_drawing', () => {
        data = []
        io.emit('show_drawing', null)
    })

    socket.on('drawing', draw => {
        data.push(draw)
        io.emit('show_drawing', draw)
    })

    socket.on('disconnect', () => {
        users = users - 1
        io.emit('users_counter', users)
        console.log('user disconnected');
    })
})

server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})