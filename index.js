// console.log('Hello World');

var Bandwidth = require("node-bandwidth");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var http = require("http").Server(app);

var myBWNumber = process.env.BANDWIDTH_PHONE_NUMBER;

var myCreds = {
    userId    : process.env.BANDWIDTH_USER_ID,
    apiToken  : process.env.BANDWIDTH_API_TOKEN,
    apiSecret : process.env.BANDWIDTH_API_SECRET
};

var client = new Bandwidth(myCreds);

app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get("/", function (req, res) {
    //console.log(req);
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

app.post("/outbound-callbacks", function (req, res) {
    var body = req.body;
    console.log(body);
    if (isAnswer(body.eventType)) {
        speackSentenceInCall(body.callId, "Hello from Bandwidth")
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        })
    }
    else if (isSpeakingDone(body)) {
        client.Call.hangup(body.callId)
        .then(function () {
            console.log("Hanging up call");
        })
        .catch(function (err) {
            console.log("Error hanging up the call, it was probably already over")
            console.log(err);
        });
    }

});

app.post("/calls", function (req, res) {
    var callbackUrl = getBaseUrl(req) + "/outbound-callbacks";
    var body = req.body;
    var phoneNumber = body.phoneNumber;
    createCallWithCallback(phoneNumber, myBWNumber, callbackUrl)
    .then(function (call) {
        console.log(call);
        res.send(call).status(201);
    })
    .catch(function (err) {
        console.log(err);
        console.log("ERROR CREATING CALL 😢");
    });
});

var isAnswer = function (eventType) {
    return (eventType === "answer");
}

var isSpeakingDone = function (callBackEvent) {
    return (callBackEvent.eventType === "speak" && callBackEvent.state === "PLAYBACK_STOP");
}

var createCallWithCallback = function (toNumber, fromNumber, callbackUrl) {
    return client.Call.create({
        from: fromNumber,
        to: toNumber,
        callbackUrl: callbackUrl
    });
};

var speackSentenceInCall = function (callId, sentence) {
    return client.Call.speakSentence(callId, sentence);
}

app.post("/call-callback", function (req, res) {
    var body = req.body;
    res.sendStatus(200);
    if (body.eventType === "answer"){
        client.Call.speakSentence(body.callId, "I still really like dogs better")
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

var getBaseUrl = function (req) {
    return 'http://' + req.hostname;
};



var messagePrinter = function (message) {
    console.log('Using the message printer');
    console.log(message);
}


var sendMessage = function (params) {
    return client.Message.send({
        from : params.from,
        to   : params.to,
        text : "404 Cats are Great, but still not as awesome as dogs",
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
