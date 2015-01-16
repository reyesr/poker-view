var express = require('express')
    ;

var counter = 0;

//// The observer to which the poker engine server can connect to
//var pokerObserverRouter = express.Router();
//var pokerStats = new PokerStats.PokerStats();
//app.use("/observer/", new PokerMachineRemoteObserver(pokerObserverRouter, pokerStats, function(event){
//    io.emit("game complete", event);
//}));

function PokerMachineRemoteObserver(router, pokerStats, eventCallback) {

    router.post('/complete', function(req, res) {
        console.log("request ", counter++);
        pokerStats.addGameObject(req.body);
        res.send({});
        eventCallback(req.body);
    });

    return router;
}

module.exports = PokerMachineRemoteObserver;
