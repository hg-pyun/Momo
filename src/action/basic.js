var replySet = ["냐앙~", "냐오오옹~", "냥 ~ (//ㅅ//)", "냥? =ටᆼට=", "(ΦωΦ)", "냐옹~(⁎˃ᆺ˂)", "(뒹굴뒹굴) (ㅇㅅㅇ❀)", "(=‘ｘ‘=)", "(๑òᆺó๑)", "∑(ΦдΦlll", "(≧∇≦*)"];

module.exports.getBasicExpress = function () {
    return [{
        "type": "text",
        "text": replySet[Math.floor(Math.random() * replySet.length)]
    }];
};