const AreaList = require('../store').AreaList;
const TextMessageTemplate = require('./template/TextMessageTemplate');

exports.SendMessage = (client, event) => {
    const text = event.message.text;
    const replyToken = event.replyToken;

    if (text === '今日の感染者数') {
        client.replyMessage(replyToken, TextMessageTemplate.Template('照会したい都道府県を送信してください。'));
    } else if (AreaList.includes(text)) {
        client.replyMessage(replyToken, TextMessageTemplate.Template(`${text}のデータを照会中です。。。`));
    } else {
        client.replyMessage(replyToken, TextMessageTemplate.Template('エラーです。'));
    }
};
