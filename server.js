const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/slack/interactive', async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  if (payload.type === 'block_actions' && payload.actions[0].value === 'complete') {
    const token = process.env.SLACK_BOT_TOKEN;
    const ts = payload.message.ts;
    const channel = payload.channel.id;

    try {
      await axios.post('https://slack.com/api/chat.delete', {
        channel: channel,
        ts: ts
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      res.status(200).send('');
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).send('Error deleting message');
    }
  } else {
    res.status(200).send('');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000);
});
