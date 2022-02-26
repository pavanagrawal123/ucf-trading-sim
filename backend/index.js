const express = require('express');
const app = express();
const port = 4000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, { cors: { origin: true } });

let socket = null;

const cors = require('cors');

require('google-closure-library');
goog.require('goog.structs.PriorityQueue');

var buyOrderBook = new goog.structs.PriorityQueue();
var sellOrderBook = new goog.structs.PriorityQueue();
var PNLs = {};
var Positions = {};

function addPosition(person, quantity, price, sign) {
  if (!Positions[person]) {
    Positions[person] = {
      position: sign * quantity,
      cash: -sign * price * quantity,
      orders: [],
    };
  } else {
    Positions[person].position += sign * quantity;
    Positions[person].cash -= sign * price * quantity;
  }

  Positions[person].orders.push({
    price,
    quantity,
  });
}

function matchOrders() {
  if (-buyOrderBook.peekKey() >= sellOrderBook.peekKey()) {
    const buyOrder = buyOrderBook.peek();
    const sellOrder = sellOrderBook.peek();
    if (buyOrder.quantity == sellOrder.quantity) {
      addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1);
      addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1);
      buyOrderBook.dequeue();
      sellOrderBook.dequeue();
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        buyOrder.quantity,
        buyOrder.price
      );
    } else if (buyOrder.quantity > sellOrder.quantity) {
      addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1);
      addPosition(buyOrder.person, sellOrder.quantity, buyOrder.price, 1);
      sellOrderBook.dequeue();
      buyOrder.quantity -= sellOrder.quantity;
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        sellOrder.quantity,
        buyOrder.price
      );
    } else {
      addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1);
      addPosition(sellOrder.person, buyOrder.quantity, buyOrder.price, -1);
      buyOrderBook.dequeue();
      sellOrder.quantity -= buyOrder.quantity;
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        buyOrder.quantity,
        buyOrder.price
      );
    }

    matchOrders();
  }
}

function emitOrderMatched(buyer, seller, quantity, price) {
  console.log('matched');
  socket.emit('orderMatched', {
    buyer: buyer,
    seller: seller,
    quantity: quantity,
    price: price,
  });
}

const priceHistory = [];

function getAndEmitPrice() {
  let newPrice = 0;
  if (!buyOrderBook.isEmpty() && !sellOrderBook.isEmpty()) {
    newPrice = (buyOrderBook.peek().price + sellOrderBook.peek().price) / 2;
  } else if (priceHistory.length != 0) {
    newPrice = priceHistory[priceHistory.lastIndexOf()];
  }
  socket.emit('tickPrice', {
    price: newPrice,
  });
  priceHistory.push(newPrice);
  if (priceHistory.length == 3600) {
    priceHistory.splice(0, 100);
  }
}

app.use(express.json());

app.use(cors());

app.post('/order', (req, res) => {
  const { price, type, person, quantity } = req.body;
  switch (type) {
    case 'BUY':
      buyOrderBook.enqueue(-price, { price, quantity, person });
      break;
    case 'SELL':
      sellOrderBook.enqueue(price, { price, quantity, person });
  }
  matchOrders();
  res.send({
    bestBid: buyOrderBook.peekKey(),
    bestAsk: sellOrderBook.peekKey(),
    Positions,
  });
});

app.get('/order', (req, res) => {

});
app.get('/', (req, res) => {
  res.send('Hello World!');
});

let interval;

io.on('connection', (soc) => {
  console.log('a user connected');

  socket = soc;
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getAndEmitPrice(), 1000);

  socket.on('disconnect', (reason) => {
    console.log('a user disconnected');
  });
});

server.listen(4000, () => {
  console.log('listening on *:4000');
});
