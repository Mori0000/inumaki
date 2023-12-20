const ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN');
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';

function doPost(e) {

  // 送られてきたデータの取り出し
  const json = JSON.parse(e.postData.contents);
  const data = json.events[0]

  const message = createReplyMessage(data.message.text);

  // 返信メッセージの構築
  const option = {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': data.replyToken,
      'messages': [{
        "type": "text",
        "text": message
      }],
    }),
  }

  UrlFetchApp.fetch(LINE_URL,option);
}

function createReplyMessage(receivedMessage) {
  // 特定の応答
  if(receivedMessage === '上野'){
   return '潰れろ！！！！'
  }
  if(receivedMessage === '明日の天気'){
    const result = UrlFetchApp.fetch('https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json');
    const tenkiJson = JSON.parse(result);
    const tenki = tenkiJson[0].timeSeries[0].areas[0].weathers[1];
    return tenki;
  }

  // ランダムな応答
  const randomReplies = [
    'ツナマヨ',
    'エビマヨ',
    'こんぶ',
    'すじこ',
    'おかか',
    'シャケ',
    'いくら',
    '明太子'
  ];

  // ランダムに返信を選択
  const randomIndex = Math.floor(Math.random() * randomReplies.length);
  return randomReplies[randomIndex];
}

function analyzeSentiment(text) {
  const apiURL = 'https://language.googleapis.com/v1/documents:analyzeSentiment?key=YOUR_API_KEY';
  const payload = {
    document: {
      type: 'PLAIN_TEXT',
      content: text
    }
  };

  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  const response = UrlFetchApp.fetch(apiURL, options);
  const result = JSON.parse(response.getContentText());
  return result.documentSentiment.score; // このスコアを使って好印象か悪印象かを判断
}

function createReplyMessage(receivedMessage) {
  const sentimentScore = analyzeSentiment(receivedMessage);

  // 好印象と悪印象の返信例
  if (sentimentScore > 0.25) { // 好印象とみなすスコアのしきい値
    // 好印象の返信を行う
  } else if (sentimentScore < -0.25) { // 悪印象とみなすスコアのしきい値
    // 悪印象の返信を行う
  } else {
    // 中立または不明瞭な場合の返信
  }
}



