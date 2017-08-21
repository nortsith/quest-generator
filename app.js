var express = require('express');
var app = express();
var serv = require('http').Server(app);
var data =  require('./routes/data');
var io = require('socket.io')(serv,{'forceNew':true});

app.get('/',function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
app.use('/',data);

serv.listen(process.env.PORT || 2000);
console.log("Server Started");

var SOCKET_LIST = {};
io.sockets.on('connection',function(socket){
  socket.id = Math.random();
  SOCKET_LIST[socket.id] = socket;

  socket.on('new_moment_added',function(moment){
    for(var i in SOCKET_LIST){
      SOCKET_LIST[i].emit('add_moment',moment);
    }
  });
});
