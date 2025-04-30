const amqp = require('amqplib');

const QUEUE = 'product_monitoring_queue';

async function sendProduct(product) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(QUEUE);

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(product)));
  console.log('Produto enviado:', product);

  await channel.close();
  await connection.close();
}

// Exemplo de envio
const product = {
  name: 'Smartphone XYZ',
  price: 1220.00,
  url: 'https://lojaexemplo.com/produto123',
  ecommerce: 'Loja Exemplo'
};

sendProduct(product);
