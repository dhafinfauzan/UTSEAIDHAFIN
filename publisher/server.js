const express = require('express');
const amqp = require('amqplib');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const PORT = process.env.PORT || 3000;
const AMQP_URL = 'amqp://localhost';

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect(AMQP_URL);
  channel = await connection.createChannel();
  await channel.assertQueue('schedule');
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/publish', async (req, res) => {
  const { message } = req.body;
  await channel.sendToQueue('schedule', Buffer.from(message));
  res.redirect('/');
});

app.listen(PORT, async () => {
  console.log(`Publisher running on port ${PORT}`);
  await connectRabbitMQ();
});
