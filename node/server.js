var socket = require('socket.io'),
    express = require('express'),
    logger = require('winston'),
    http = require('http');

logger.add(new logger.transports.Console({ colorize: true, timestamp: true }));
app = express();
var http_server = http.createServer(app).listen(3001);

var io = socket.listen(http_server);

io.sockets.on("connection", function(socket) {
    logger.info('SocketIO > Connected socket ' + socket.id);
    socket.on("room", function(data) {
        logger.info('SocketIO >Room ' + data);
        socket.join(data);
        io.sockets.in('1').emit('message', 'joined');
    });
    socket.on("disconnect", function(data) {
        logger.info('ktuś się rozłączył');
        logger.info(data);
    });
});