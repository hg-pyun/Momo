const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const config = require('./config');
const reply = require('./reply');

const actionBasic = require('./action/basic');
const actionHelp = require('./action/help');
const actionEnjoy = require('./action/enjoy');
const actionScheduler = require('./action/scheduler');

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
            else if(/^reserve/g.test(cmd) || /^예약/g.test(cmd)){

                var receiverId = null;
                var dropCmdMessages = cmd.split('reserve ')[1];

                switch (source.type){
                    case "user" : receiverId = source.userId; break;
                    case "group" : receiverId = source.groupId; break;
                    case "room" : receiverId = source.roomId; break;
                }
                
                if(dropCmdMessages.indexOf('-l') != -1){
                    reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionScheduler.getReservedList(receiverId));
                }
                else if(dropCmdMessages.indexOf('-r') != -1){
                    var scheduledId = dropCmdMessages.replace('-r', '').trim();
                    var removeItemInfo = actionScheduler.removeReservedItem(receiverId, scheduledId);
                    reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionScheduler.gerRemoveMessage(removeItemInfo))
                }
                else{
                    var onceFlag = true;
                    var data = actionScheduler.reserveParser(dropCmdMessages);
                    
                    if(dropCmdMessages.indexOf('-once') == -1){
                        onceFlag = false;
                    }

                    if(dropCmdMessages.indexOf('-once') == -1){
                        onceFlag = false;
                    }

                    actionScheduler.setReserve(config.CHANNEL_ACCESS_TOKEN, receiverId, data.time, data.message, onceFlag);
                    reply.send(config.CHANNEL_ACCESS_TOKEN, eventObj.replyToken, actionScheduler.getReservedMessage(data.time, data.message, !onceFlag))
                }
            }

        }
    }

    response.sendStatus(200);
});
//
// app.use(express.static(__dirname + '/img'));

https.createServer(https_options, app).listen(443, function(){
    console.log("Momo Server is Running");
});