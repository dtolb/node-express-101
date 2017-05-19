// console.log('Hello World');

var Bandwidth = require("node-bandwidth");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

var myCreds = {
    userId    : process.env.BANDWIDTH_USER_ID,
    apiToken  : process.env.BANDWIDTH_API_TOKEN,
    apiSecret : process.env.BANDWIDTH_API_SECRET
};

var client = new Bandwidth(myCreds);

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get("/", function (req, res) {
    console.log(req);
    res.send("Hello World");
});

app.post("/message-callback", function (req, res) {
    var body = req.body;
    res.sendStatus(200);
    if (body.direction === "in") {
        var numbers = {
            to: body.from,
            from: body.to
        }
        sendMessage(numbers);
    }
});

app.post("/call-callback", function (req, res) {
    var body = req.body;
    res.sendStatus(200);
    if (body.eventType === "answer"){
        client.Call.speakSentence(body.callId, "I still like dogs better")
        .then(function () {
            console.log("speakSentence sent");
        })
        .catch(function (err) {
            console.log(err);
        });

    }
    else if (body.eventType === "speak" && body.state === "PLAYBACK_STOP") {
        client.Call.hangup(body.callId)
        .then(function () {
            console.log("Hanging up call");
        })
        .catch(function (err) {
            console.log("Error hanging up the call, it was probably already over")
            console.log(err);
        });
    }
    else {
        console.log(body);
    }
});

var messagePrinter = function (message) {
    console.log('Using the message printer');
    console.log(message);
}

var sendMessage = function (params) {
    return client.Message.send({
        from : params.from,
        to   : params.to,
        text : "404 Cats are Great",
        media: "http://s.quickmeme.com/img/a8/a8022006b463b5ed9be5a62f1bdbac43b4f3dbd5c6b3bb44707fe5f5e26635b0.jpg"
    })
    .then(function(message){
        messagePrinter(message);
        return client.Message.get(message.id);
    })
    .then(messagePrinter)
    .catch(function (err) {
        console.log(err);
    });
}

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});

// var numbers = {
//     from: "+13204601137",
//     to: "+19197891146"
// };

// sendMessage(numbers);
