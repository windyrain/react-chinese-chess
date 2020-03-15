var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let waitRooms = {};
let readyRooms = {};

io.on('connection', function(socket) {
    const result = socket.request.url.match(/roomId=([0-9]+)/);

    if (socket.request.url.indexOf('joinType=start') > -1) {
        // 主动开局，生成房间号
        const roomId = Math.floor(Math.random() * 1000 + 8000);
        console.log('roomId', roomId);
        // 将 socket 加入这个房间
        socket.join(roomId);
        // 将房间号存到 waitRooms 中
        waitRooms[roomId] = 'waiting';
        // 告诉客户端初始化成功，并传递房间号
        socket.emit('init', {roomId});
    } else if (result && result.length > 1) {
        // 加入棋局，先获取加入的房间号
        console.log('joinRoomId', result[1]);
        const joinRoomId = result[1];
        if (waitRooms[joinRoomId] === 'waiting') {
            // 生成自己的房间号
            const roomId = Math.floor(Math.random() * 1000 + 8000);
            // 删除等待中状态
            delete waitRooms[joinRoomId];
            // 记录对战双方
            readyRooms[roomId] = joinRoomId;
            readyRooms[joinRoomId] = roomId;
            // 加入自己房间号
            socket.join(roomId);
            // 通知客户端初始化成功，并传递房间号
            socket.emit('init', {roomId});
            // 告诉创建游戏的人，加入的人来了
            io.sockets.in(joinRoomId).emit('joined', {roomId});
        } else {
            socket.emit('init', {message: '房间号不存在'});
        }
    }

    socket.on('position', (data) => {
        // 找到对战方的房间号，发送变更的棋子坐标
        io.sockets.in(readyRooms[data.roomId]).emit('position', {position: data.position});
    });    
});

http.listen(6999, function() {
    console.log('listening on *:3000');
});
