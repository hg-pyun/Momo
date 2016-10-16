const emotion = require('./emotion');

module.exports.getRandomExpress = function (cmd) {

    var arrayString = cmd.match(/\[.*\]/gi);
    arrayString += "";
    arrayString = arrayString.split("[").join("");
    arrayString = arrayString.split("]").join("");

    var array = arrayString.split(',');

    var enjoyEmotions = emotion.enjoySet;

    return [{
        "type": "text",
        "text":  enjoyEmotions[Math.floor(Math.random() * enjoyEmotions.length)]+ " [" + array[Math.floor(Math.random() * array.length)] + "]"
    }];
};

var foodlist =
    ['토끼정','서가앤쿡', '고수닭갈비', '라하노카레', '유타로', '분타', '하치 돈부리',
    '우마이도','키친131', '담소사골순대', '버거킹', 'kfc', '가츠루', '아비꼬', '백반', '미각',
    '돈까스에 미치다', '김치찜', '부대찌개', '미소야', 'ak 플라자 7층', '카레', '스시', '국밥' ];

module.exports.getFoodExpress = function () {

    var enjoyEmotions = emotion.enjoySet;

    return [{
        "type": "text",
        "text":  "momo가 전단지를 물어왔습니다.\n" +
        enjoyEmotions[Math.floor(Math.random() * enjoyEmotions.length)] +
        "\n[" + foodlist[Math.floor(Math.random() * foodlist.length)] + "]"
    }];
};