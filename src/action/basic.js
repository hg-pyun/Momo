const emotion = require('./emotion');

module.exports.getBasicExpress = function () {
    
    var basicEmotion = emotion.basicSet;
    
    return [{
        "type": "text",
        "text": basicEmotion[Math.floor(Math.random() * basicEmotion.length)]
    }];
};