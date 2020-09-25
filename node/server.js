var socket = require('socket.io'),
    express = require('express'),
    logger = require('winston'),
    http = require('http');

const util = require('util')

logger.add(new logger.transports.Console({ colorize: true, timestamp: true }));
app = express();
var http_server = http.createServer(app).listen(3001);

var io = socket.listen(http_server);

var users = {};

io.sockets.on("connection", (socket) => {
    socket.on("refreshUsers", (data) => {
        if (!users[data.userName]) {
            users[data.userName] = {
                userName : data.userName,
                userRole : data.userName,
                typing : data.typing,
                afk: data.afk
            }
        }
        users[data.userName].timestamp = Date.now();
        emitUsers()
    });
    socket.on("room", (data) => {
        logger.info('SocketIO >Room ' + data);
        //check permissions in php how? api with jwt?
        socket.join(data);
    });
    socket.on("new_message", (data) => {
        logger.info('new message ' + data);
        io.sockets.in(data.channel).emit("message", data.message);
    });
    socket.on("disconnect", (data) => {
        logger.info("disconnected");
    });
    socket.on("typing", (data) => {
        if (!users[data.userName]) {
            return;
        }
        users[data.userName].typing = data.typing;
        emitUsers();
    });
});

(function checkTimestamp() {
    logger.info('checked timestamps');
    const timestamp = Date.now() - 180000;
    let removedUsers = 0;
    Object.keys(users).forEach(function (key) {
        if (users[key].timestamp <= timestamp) {
            delete users[key];
            console.log('removed user');
            removedUsers++;
        }
    });
    if (removedUsers) {
        console.log('emit users');
        emitUsers();
    }

    setTimeout(checkTimestamp, 180000);
})();

function emitUsers() {
    io.sockets.emit("users", users);
}