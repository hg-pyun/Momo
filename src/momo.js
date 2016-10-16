const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config');
const reply = require('./reply');
const actionBasic = require('./action/basic');

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
    response.end('<h1>Momo - phg2491@naver.com<h1>');
});

app.post('/hook', function (request, response) {

    var eventObj = request.body.events[0];
    var source = eventObj.source;
    var message = eventObj.message;

    // request log
    console.log('======================', new Date() ,'======================');
    console.log('[request] : ', request.body);
    console.log('[request source]', eventObj.source);
    console.log('[request message]', eventObj.message);

    if(message.type = "text" && message.text.indexOf("@momo") != -1){
        reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionBasic.getBasicExpress());
    }
    
    response.sendStatus(200);
});

https.createServer(https_options, app).listen(443, function(){
    console.log("Momo Server is Running");
});