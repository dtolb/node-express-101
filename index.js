
const Bandwidth = require("node-bandwidth");
const express = require("express");
const bodyParser = require("body-parser");

let app = express();
let http = require("http").Server(app);

// your bandwidth phonenumber
const myBWNumber = process.env.BANDWIDTH_PHONE_NUMBER;

// your bandwidth API creds
const myCreds = {
    userId    : process.env.BANDWIDTH_USER_ID,
    apiToken  : process.env.BANDWIDTH_API_TOKEN,
    apiSecret : process.env.BANDWIDTH_API_SECRET
};

//create bandwidth client
const client = new Bandwidth(myCreds);

//Express setup
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 3000));

app.get("/", (req, res) => {
    //console.log(req);
    res.send("Hello World");
});

app.post("/outbound-callbacks", (req, res) => {
    const body = req.body;
    console.log(body);
    if (body.eventType === "answer") {
        const options = {
            sentence : "hola de Bandwidth",
            gender   : "male",
            locale   : "es",
            voice    : "Jorge"
        }
        client.Call.playAudioAdvanced(body.callId, options)
        .then(function (response) {
            console.log('Response from Bandwidth Server: ')
            console.log(response);
        })
        .catch(function (error) {
            console.log('Error from Bandwidth Server: ')
            console.log(error);
        })
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
});

app.post("/create-call", function (req, res) {
    const callbackUrl = getBaseUrl(req) + "/outbound-callbacks";
    const body = req.body;
    const phoneNumber = body.phoneNumber;
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

const createCallWithCallback = (toNumber, fromNumber, callbackUrl) => {
    return client.Call.create({
        from        : fromNumber,
        to          : toNumber,
        callbackUrl : callbackUrl
    });
};

const getBaseUrl = req => `http://${req.hostname}`;

http.listen(app.get('port'), () => {
    console.log('listening on *:' + app.get('port'));
});

