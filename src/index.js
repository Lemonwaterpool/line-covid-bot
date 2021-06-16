'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const ButtonOrErrorMessage = require('./reply/ButtonOrErrorMessage');

const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};

const app = express();
const client = new line.Client(config);

app.get('/', (req, res) => {
    res.send('Hello world');
})

app.post('/api/line/message', line.middleware(config), async (req, res) => {
    const event = req.body.events[0];
    const eventType = event.message.type;

    if (eventType === 'text') {
        await ButtonOrErrorMessage.SendMessage(client, event);
    }
});

app.listen(PORT, () => {
    console.log('server listening');
});
