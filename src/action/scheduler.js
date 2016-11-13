const schedule = require('node-schedule');
const push = require('../push');

const emotion = require('./emotion');

var reservationQueue = [];
var scheduledId = 0;
module.exports.reserveParser = function (message) {
    
    console.log('[scheduler]', message);
    var splitMessages = message.split(',');

    return {
        time : splitMessages[0].trim(),
        message: splitMessages[1].replace('-once','').trim()
    }
};

module.exports.setReserve = function (channelAccessToken, receiverId, time, message, once) {

    var id = scheduledId;

    var job = schedule.scheduleJob(time, function(){
        console.log('[scheduler] send scheduled message', receiverId, time, message);
        push.send(channelAccessToken, receiverId, makePainMessageTemplate(message));
        if(once){
            removeReservedItem(receiverId, id);
        }

    });

    reservationQueue.push({
        scheduledId : (scheduledId++).toString(),
        receiverId : receiverId,
        time : time,
        message : message,
        once : once,
        job : job
    });
};

module.exports.getReservedList = function (receiverId) {
    
    var basicEmotion = emotion.basicSet;
    var count = 0;
    var message = " [Momo가 Reservation List를 물고왔습니다.] \n" +
        "=====================";

    for(var i=0; i<reservationQueue.length; i++) {
        if (reservationQueue[i].receiverId == receiverId) {
            count++;
            message +=
                "\nId : " + reservationQueue[i].scheduledId +
                "\n예약 시간 : " + reservationQueue[i].time +
                "\n메세지 : " + reservationQueue[i].message +
                "\n반복 : " + !reservationQueue[i].once +
                "\n====================="
        }
    }

    return [{
        "type": "text",
        "text": (count > 0) ? basicEmotion[Math.floor(Math.random() * basicEmotion.length)] + message : "[Momo가 쪽지를 물고왔습니다.] \nReservation List is Empty."
    }];
};

module.exports.getReservedMessage = function (time, message, once) {

    var basicEmotion = emotion.basicSet;

    return [{
        "type": "text",
        "text": basicEmotion[Math.floor(Math.random() * basicEmotion.length)]+
        "\nId : " + scheduledId +
        "\n예약 시간 : " + time +
        "\n메세지 : " + message +
        "\n반복 : " + once
    }];
};

module.exports.gerRemoveMessage = function (removeMessageInfo) {

    var basicEmotion = emotion.basicSet;
    var message = basicEmotion[Math.floor(Math.random() * basicEmotion.length)]+ "\n[Momo가 Id값을 못찾고 있습니다.]";

    if(removeMessageInfo != null){
        message = "[Remove Reservation] " + basicEmotion[Math.floor(Math.random() * basicEmotion.length)]+
            "\nId : " + removeMessageInfo.scheduledId +
            "\n예약 시간 : " + removeMessageInfo.time +
            "\n메세지 : " + removeMessageInfo.message +
            "\n반복 : " + removeMessageInfo.once
    }

    return [{
        "type": "text",
        "text": message
    }];
};


module.exports.removeReservedItem = removeReservedItem;

function removeReservedItem (receiverId, scheduledId) {

    var removeItemInfo = null;

    for(var i=0; i<reservationQueue.length; i++) {
        var item = reservationQueue[i];
        if (reservationQueue[i].receiverId == receiverId && item.scheduledId == scheduledId) {
            removeItemInfo = reservationQueue[i];
            item.job.cancel();
            reservationQueue.splice(i, 1);
        }
    }
    return removeItemInfo
}


function makePainMessageTemplate(message) {
    return [{
        "type":"text",
        "text": "[Momo가 쪽지를 물고왔습니다.]\n"+"[Reserved] "+ message
    }]
}