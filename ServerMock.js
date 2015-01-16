var MachinePoker = require('machine-poker')
    , LocalSeat = MachinePoker.seats.JsLocal
    , RemoteSeat = MachinePoker.seats.Remote
    , CallBot = require('./examples/bots/callBot')
    , RandBot = require('./examples/bots/randBot')
    , FoldBot = require('./examples/bots/foldBot')
    , narrator = MachinePoker.observers.narrator
    , fileLogger = MachinePoker.observers.fileLogger('./examples/results.json');

var URL = require("url");
var request = require("request-json");


function runTest(url) {
    var table = MachinePoker.create({
        maxRounds: 100
    });
    // Source be found at: https://github.com/mdp/RandBot
    //var remotePlayerUrl = "http://randbot.herokuapp.com/randBot";
    //
    //var remotePlayer = RemoteSeat.create(remotePlayerUrl);
    //remotePlayer.on('ready', function () {
    var players = [
        //remotePlayer
        //,
        LocalSeat.create(CallBot)
        , LocalSeat.create(FoldBot)
        , LocalSeat.create(RandBot)
        , LocalSeat.create(RandBot)
    ];
    table.addPlayers(players);
    table.on('tournamentClosed', function () { 
        //process.exit();
    });
    table.addObserver(new ObserverProxy(url));

    table.start();
    //});

    // Add some observers
    //table.addObserver(narrator);
    //table.addObserver(fileLogger);
    
}

function ObserverProxy(url) {
    var httpClient = request.newClient(url);

    this.complete = function(gameObject) {
        var destination = URL.resolve(url, "./complete");
        console.log("sending gameobject to ", destination);
        httpClient.post("complete", gameObject, function(err, httpResponse, body) {
            if (err) {
                console.log("Failed sending completed game object to ", destination, err.toString());
            }
        });
    };
}

exports.runTests = runTest;