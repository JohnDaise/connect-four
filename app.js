var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("server started");

var SOCKET_LIST = {};



var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;

    socket.emit('serverMsg',{
        msg: 'hello',
    });
});

setInterval(function(){
    for(var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        // each socket is a player
        // this loop goes thru each player 
        // should send each player's current board after each move
        socket.emit('newBoard', {
            // data for a board, arrays
        });
    }
}, 1000/25);