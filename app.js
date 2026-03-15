const express = require('express');
const { createClient } = require('redis');

const app = express();
const redisClient = createClient({
  url: 'redis://redis:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

app.get('/', async (req, res) => {
  try {
    let count = await redisClient.incr('request_counter');
    res.json({ message: 'Счетчик запросов', count });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка Redis' });
  }
});

app.get('/stats', async (req, res) => {
  try {
    const count = await redisClient.get('request_counter');
    res.json({ total_requests: parseInt(count || '0') });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка Redis' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
