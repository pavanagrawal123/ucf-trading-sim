const express = require('express');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

require('google-closure-library');
goog.require('goog.structs.PriorityQueue');

var buyOrderBook = new goog.structs.PriorityQueue();
var sellOrderBook = new goog.structs.PriorityQueue();
var PNLs = {};
var Positions = {};

function addPosition(person, quantity, price) {
  if (!Positions[person]) {
    Positions[person] = [];
  }
  Positions[person].push({
    price,
    quantity,
  });
}

function matchOrders() {
  if (buyOrderBook.peekKey() >= -sellOrderBook.peekKey()) {
    const buyOrder = buyOrderBook.dequeue();
    const sellOrder = sellOrderBook.dequeue();
    addPosition(buyOrder.person, 1, buyOrder.price);
    addPosition(sellOrder.person, -1, buyOrder.price);
    matchOrders();
  }
}

app.use(express.json());

app.post('/order', (req, res) => {
  const { price, type, person } = req.body;
  console.log(req.body);
  console.log(price);
  console.log(type);
  console.log(person);
  switch (type) {
    case 'BUY':
      buyOrderBook.enqueue(price, { price, person });
      break;
    case 'SELL':
      sellOrderBook.enqueue(-price, { price, person });
  }
  matchOrders();
  res.send({
    bestBid: buyOrderBook.peekKey(),
    bestAsk: sellOrderBook.peekKey(),
    Positions,
  });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {  console.log('a user connected');});

server.listen(3000, () => {console.log('listening on *:3000');});