var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let rooms = {};

io.on('connection', function(socket) {
    const result = socket.request.url.match(/roomId=([0-9]+)/);

    if (socket.request.url.indexOf('joinType=start') > -1) {
        const roomId = Math.floor(Math.random() * 1000 + 8000);
        console.log('roomId', roomId);
        socket.join(roomId);
        socket.emit('init', {roomId});
    } else if (result && result.length > 1) {
        console.log('joinRoomId', result[1]);
        const joinRoomId = result[1];
        const roomId = Math.floor(Math.random() * 1000 + 8000);
        socket.join(roomId);
        rooms[joinRoomId] = roomId;
        rooms[roomId] = joinRoomId;
        socket.emit('init', {roomId});
    }

    socket.on('position', (data) => {
        console.log(JSON.stringify(data));
        console.log(rooms);
        console.log(rooms[data.roomId]);
        io.sockets.in(rooms[data.roomId]).emit('position', {position: data.position});
    });    
});

http.listen(6999, function() {
    console.log('listening on *:3000');
});
