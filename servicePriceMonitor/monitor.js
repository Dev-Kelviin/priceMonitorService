const amqp = require('amqplib');
const QUEUE = 'product_monitoring_queue';

const priceHistory = {};

async function start() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE);

    console.log('Aguardando produtos na fila...');

    channel.consume(QUEUE, async (msg) => {
      if (msg !== null) {
        const product = JSON.parse(msg.content.toString());

        const { name, price, url, ecommerce } = product;

        const oldPrice = priceHistory[url];
        priceHistory[url] = price;

        if (oldPrice && Math.abs(price - oldPrice) / oldPrice >= 0.10) {
          console.log(`Preço alterado para "${name}" (${ecommerce}):`);
          console.log(`De R$${oldPrice.toFixed(2)} para R$${price.toFixed(2)}`);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('Erro ao iniciar o serviço:', err.message);
  }
}

start();
