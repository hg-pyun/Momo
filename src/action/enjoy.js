module.exports.getRandomExpress = function (cmd) {

    var arrayString = cmd.match(/\[.*\]/gi);
    arrayString += "";
    arrayString = arrayString.split("[").join("");
    arrayString = arrayString.split("]").join("");

    var array = arrayString.split(',');

    return [{
        "type": "text",
        "text": array[Math.floor(Math.random() * array.length)]
    }];
};

module.exports.getFoodExpress = function () {
    
};