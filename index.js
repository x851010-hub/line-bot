const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: process.env.TOKEN,
  channelSecret: process.env.SECRET
};

const client = new line.Client(config);

const log = {};

app.post('/webhook', line.middleware(config), (req, res) => {
  res.sendStatus(200);

  req.body.events.forEach(event => {
    if (event.type !== 'message') return;
    if (event.message.type !== 'text') return;

    const userId = event.source.userId;
    const now = Date.now();

    log[userId] = (log[userId] || []).filter(t => now - t < 10000);
    log[userId].push(now);

    if (log[userId].length >= 5) {
      client.replyMessage(event.replyToken, {
        type: 'text',
        text: '⚠️ 請放慢發言速度，避免洗版'
      });
    }
  });
});

app.listen(3000);
