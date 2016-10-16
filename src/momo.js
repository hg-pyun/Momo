const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const requestSender = require('request');

const config = require('./config');

var app = express();

// set SSL
var https_options = {
    ca: fs.readFileSync(config.SSL.CA_PATH, 'utf8'),
    key: fs.readFileSync(config.SSL.KEY_PATH, 'utf8'),
    cert: fs.readFileSync(config.SSL.CERT_PATH, 'utf8')
};

app.use(bodyParser.json());

app.get('/hook', function (reqeust, response) {
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.end('<h1>Momo<h1>');
});

app.post('/hook', function (request, response) {

    console.log('request', request.body, typeof request.body);

    var eventObj = request.body.events[0];

    console.log('eventObj message', eventObj.message);

    if(eventObj.message.type = "text" && eventObj.message.text.indexOf("@momo") != -1){
        console.log('call momo');

        var headers = {
            'Content-type' : 'application/json',
            'Authorization' : 'Bearer ' + config.CHANNEL_ACCESS_TOKEN
        };

        var options = {
            url: 'https://api.line.me/v2/bot/message/reply',
            method: 'POST',
            headers: headers,
            json: {
                replyToken : eventObj.replyToken,
                messages : [{
                    "type": "text",
                    "text": "냐앙~//ㅅ//"
                }]
            }
        };

        requestSender(options, function (error, response, body) {
            console.log('response', response.statusCode);
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
            }
            else{
                console.log('requestSender', error);
            }
        })
    }
    response.sendStatus(200);
});

https.createServer(https_options, app).listen(443, function(){
    console.log("Momo Server is Running");
});