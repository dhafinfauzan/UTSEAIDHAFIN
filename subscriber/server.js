const express = require('express');
const amqp = require('amqplib');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

const PORT = 4000;
const AMQP_URL = 'amqp://rabbitmq'; // Sesuaikan dengan nama service RabbitMQ di docker-compose.yml

let messages = []; // Array untuk menyimpan pesan yang diterima

async function connect() {
  const conn = await amqp.connect(AMQP_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue('messages');

  channel.consume('messages', message => {
    const content = message.content.toString();
    console.log(`Received message: ${content}`);
    messages.push(content); // Menyimpan pesan ke array
    channel.ack(message);
  });

  return channel;
}

app.get('/', (req, res) => {
  res.render('index', { messages }); // Mengirim pesan ke template EJS
});

connect();

app.listen(PORT, () => console.log(`Subscriber running on port ${PORT}`));
