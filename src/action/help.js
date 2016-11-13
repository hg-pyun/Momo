var helpText =
    "Momo가 종이를 물어왔습니다. \n" +
    "======== Help ======== \n" +
    "@momo - call momo \n" +
    "@r[array] : return one element in array \n" +
    "@food || @밥집 : return food list \n" +
    "@reserve cron, message : reserve schedule \n" +
    "@reserve cron, message -once : reserve schedule onetime\n" +
    "@reserve -l : show schedule \n" +
    "@reserve -r id : remove schedule \n" +
    "@help || @h : view action list of momo \n" +
    "@contact || @ct : view information of momo's developer \n" +
    "=====================";

var contactText =
    "Momo가 종이를 물어왔습니다. \n" +
    "======== Contact ======== \n" +
    "@email - phg2491@gmail.com \n" +
    "Special Thanks && QA - Jaewon.Choi \n"+
    "========================";

module.exports.getHelpExpress = function () {
    return [{
        "type": "text",
        "text": helpText
    }];
};

module.exports.getContactExpress = function () {
    return [{
        "type": "text",
        "text": contactText
    }];
};