var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require("body-parser");

var PokerStats = require("./PokerStats"),
    PokerMachineRemoteObserver = require("./PokerMachineRemoteObserver");

server.listen(3001);
app.use(bodyParser.json())
// The observer to which the poker engine server can connect to
var pokerObserverRouter = express.Router();
var pokerStats = new PokerStats.PokerStats();
//app.use("/observer/", new PokerMachineRemoteObserver(pokerObserverRouter, pokerStats, function(event){
//    // io.emit("game complete", event);
//}));
var counter = 0;
app.post('/observer/complete', function(req, res) {
    
    console.log("request ", counter++);
    pokerStats.addGameObject(req.body);
    io.emit("game complete", req.body);
    res.send({});
});

app.get("/run-test", function(req, res){
    var tester = require("./ServerMock");
    tester.runTests("http://127.0.0.1:3001/observer/");
    res.send({});
});

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

io.on('connection', function (socket) {
    // console.log("Client logged", socket);
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

app.use("/", express.static(__dirname + "/public/"));

