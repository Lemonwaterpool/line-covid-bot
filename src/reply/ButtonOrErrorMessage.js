const fetch = require("node-fetch");

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
        csv_data().then(data => {
            const dataArray = [];
            const dataString = data.split("\n");
            dataString.forEach((value, index, _) => {
                dataArray[index] = value.split(",");
            });
            let latestData = dataArray[dataArray.length - 1];
            if (latestData[0] == '') {
                latestData = dataArray[dataArray.length - 2];
            }
            const areaCount = latestData[area.id];
            const date = latestData[0];
            const isUpdated = areaCount != "";
            if (isUpdated) {
                client.replyMessage(
                    replyToken,
                    TextMessageTemplate.Template(
                        `${area.name}の新規感染者数は、${areaCount}人です。(${date})`
                    )
                );
            } else {
                client.replyMessage(
                    replyToken,
                    TextMessageTemplate.Template(
                        `${area.name}の新規感染者数はまだ更新されていません。しばらく待ってから再度照会してください。(${date})`
                    )
                );
            }
        });

        return;
    }

    client.replyMessage(replyToken, TextMessageTemplate.Template("都道府県が正しく入力されていないようです。"));
};

const csv_data = () => {
    const dataPath =
        "https://raw.githubusercontent.com/swsoyee/2019-ncov-japan/master/50_Data/byDate.csv";
    const response = fetch(dataPath).then(response => response.text());
    return response;
};
