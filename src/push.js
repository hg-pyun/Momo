const requestSender = require('request');

module.exports.send = function (channelAccessToken, receiverId, messages) {

    var headers = {
        'Content-type' : 'application/json',
        'Authorization' : 'Bearer ' + channelAccessToken
    };

    var options = {
        url: 'https://api.line.me/v2/bot/message/push',
        method: 'POST',
        headers: headers,
        json: {
            to : receiverId,
            messages : messages
        }
    };

    requestSender(options, function (error, response, body) {
        console.log('response', response.statusCode);
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
        else{
            console.log('requestSender', error);
        }
    })

};