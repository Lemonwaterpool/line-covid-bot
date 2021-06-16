const Data = require("../store");
const TextMessageTemplate = require("./template/TextMessageTemplate");

exports.SendMessage = (client, event) => {
    let text = event.message.text;
    text = text
        .replace("都", "")
        .replace("府", "")
        .replace("県", "");

    const replyToken = event.replyToken;

    if (text === "今日の感染者数") {
        client.replyMessage(
            replyToken,
            TextMessageTemplate.Template("照会したい都道府県を送信してください。")
        );
        return;
    }

    const area = Data.getAreaList().find(area => area.name === text);
    if (area) {
        client.replyMessage(
            replyToken,
            TextMessageTemplate.Template(
                `${area.name}(${area.id})のデータを照会中です。。。`
            )
        );
        return;
    }

    client.replyMessage(replyToken, TextMessageTemplate.Template("エラーです。"));
};
