var consts = require('./env.local.js'),
    socket = require('socket.io'),
    express = require('express'),
    logger = require('winston'),
    http = require('http'),
    axios = require('axios');



logger.add(new logger.transports.Console({ colorize: true, timestamp: true }));
app = express();
var http_server = http.createServer(app).listen(3001);

var io = socket.listen(http_server);

let users = {};
let usersSocketId = {};

io.sockets.on("connection", (socket) => {
    socket.on("connectUser", (data) => {
        if (!users[data.userName]) {
            usersSocketId[socket.id] = data.userName;
            users[data.userName] = {
                userName : data.userName,
                userRole : data.userName,
                typing : data.typing,
                afk: data.afk
            }
        }
        emitUsers();
    });
    socket.on("room", (data) => {
        axios.get(consts.CHECK_CHANNEL_URL + data.key, {headers: {'Authorization': 'Bearer ' + data.token}})
            .then((response) => {
                if (response.data === '1') {
                    socket.join(data.key);
                }
            });
    });
    socket.on("new_message", (data) => {
        io.sockets.in(data.channel).emit("message", data.message);
    });
    socket.on("disconnect", () => {
        let key = usersSocketId[socket.id];
        delete users[key];
        delete usersSocketId[key];
        emitUsers();
    });
    socket.on("typing", (data) => {
        if (!users[data.userName]) {
            return;
        }
        users[data.userName].typing = data.typing;
        emitUsers();
    });
    socket.on("afk", (data) => {
        if (!users[data.userName]) {
            return;
        }
        users[data.userName].afk = data.afk;
        emitUsers();
    });
});

function emitUsers() {
    io.sockets.emit("users", users);
}