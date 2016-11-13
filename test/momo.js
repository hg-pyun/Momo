const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('../src/config');
const reply = require('../src/reply');

const actionBasic = require('../src/action/basic');
const actionHelp = require('../src/action/help');
const actionEnjoy = require('../src/action/enjoy');

var app = express();

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
    console.log('[request]', request.body);
    console.log('[request source] ', eventObj.source);
    console.log('[request message]', eventObj.message);

    if(message.type == "text" && message.text.indexOf("@momo") != -1){
        reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionBasic.getBasicExpress());
    }
    else if(message.type == "text" && /^@.+/g.test(message.text)){
        var cmd = message.text.split('@')[1];
        console.log('[command]', cmd);

        if(typeof cmd !== "undefined" && cmd != ""){
            if(cmd == "h" || cmd == "help"){
                reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionHelp.getHelpExpress());
            }
            else if(/^r\[.+\]/g.test(cmd)){
                reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionEnjoy.getRandomExpress(cmd));
            }
            else if(cmd == "food" || cmd == "밥집"){
                reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionEnjoy.getFoodExpress());
            }
            else if(cmd == "contact" || cmd == "ct"){
                reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionHelp.getContactExpress());
            }
        }
    }

    response.sendStatus(200);
});
//
// app.use(express.static(__dirname + '/img'));

app.listen(9000, function(){
    console.log("Momo Server is Running : http://127.0.0.1:9000");
});