const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config');
const reply = require('./reply');

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

    var eventObj = request.body.events[0];

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request] : ', request.body);
    console.log('[request source]', eventObj.source);
    console.log('[request message]', eventObj.message);

    if(eventObj.message.type = "text" && eventObj.message.text.indexOf("@momo") != -1){

        var messages = [{
            "type": "text",
            "text": "냐앙~ //ㅅ//"
        }];
        
        reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, messages);
        
    }
    response.sendStatus(200);
});

https.createServer(https_options, app).listen(443, function(){
    console.log("Momo Server is Running");
});