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

var buyOrderBook = [];
var sellOrderBook = [];
var PNLs = {};
var Positions = {};
var id = 0;
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
    'price':price*sign,
    quantity,
  });
}

function matchOrders() {
  if (buyOrderBook.length != 0 && sellOrderBook.length != 0 && buyOrderBook[0].price >= sellOrderBook[0].price) {
    var buyOrder = buyOrderBook[0];
    var sellOrder = sellOrderBook[0];
    if (buyOrder.quantity == sellOrder.quantity) {
      addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1);
      addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1);
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        buyOrder.quantity,
        buyOrder.price
      );
      buyOrderBook.shift();
      sellOrderBook.shift();
    } else if (buyOrder.quantity > sellOrder.quantity) {
      addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1);
      addPosition(buyOrder.person, sellOrder.quantity, buyOrder.price, 1);
      buyOrder.quantity -= sellOrder.quantity;
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        sellOrder.quantity,
        buyOrder.price
      );
      sellOrderBook.shift();
    } else {
      addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1);
      addPosition(sellOrder.person, buyOrder.quantity, buyOrder.price, -1);
      sellOrder.quantity -= buyOrder.quantity;
      emitOrderMatched(
        buyOrder.person,
        sellOrder.person,
        buyOrder.quantity,
        buyOrder.price
      );
      buyOrderBook.shift();
    }
    emitOrderBook();
    matchOrders();
  }
}

function emitPositions(){
    socket.emit('positions', {
        positions: Positions,
    });
}

function emitOrderMatched(buyer, seller, quantity, price) {
  console.log('matched');
  socket.emit('orderMatched', {
    buyer: buyer,
    seller: seller,
    quantity: quantity,
    price: price,
  });
  emitPositions();
}

function emitOrderBook() {
  socket.emit('orderBook', {
    buyOrderBook: buyOrderBook,
    sellOrderBook:sellOrderBook
  });
}

var priceHistory = [];

function getAndEmitPrice() {
  let newPrice = 0;
  if (buyOrderBook.length!=0 && sellOrderBook.length!=0) {
    
    newPrice = (buyOrderBook[0].price + sellOrderBook[0].price) / 2;
  } else if (priceHistory.length != 0) {
    newPrice = priceHistory[priceHistory.length - 1];
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
  let { price, type, person, quantity } = req.body;
  price = parseFloat(price);
  switch (type) {
    case 'BUY':
      buyOrderBook.push({price, quantity, person, "id": id});
      buyOrderBook.sort((a,b) => b.price-a.price);
      break;
    case 'SELL':
      sellOrderBook.push({price, quantity, person, "id": id});
      sellOrderBook.sort((a,b) => a.price - b.price);
  }
  id++;
  emitOrderBook();
  matchOrders();
  res.send({
    bestBid: buyOrderBook.length==0?-1:buyOrderBook[0].price,
    bestAsk: sellOrderBook.length==0?-1:sellOrderBook[0].price,
    Positions,
  });
});

app.get('/orders', (req, res) => {
  res.send({
    buyOrderBook: buyOrderBook,
    sellOrderBook: sellOrderBook
  });
});

app.post('/remove', (req, res) => {
  const {id, type} = req.body;
  switch (type){
    case 'BUY':
      for(var i = 0; i < buyOrderBook.length; i++){
        if(buyOrderBook[i].id==id){
          buyOrderBook.splice(i,1);
          break;
        }
      }
      break;
    case 'SELL':
      for(var i = 0; i < sellOrderBook.length; i++){
        console.log(sellOrderBook[i].id);
        if(sellOrderBook[i].id==id){
          sellOrderBook.splice(i,1);
          break;
        }
      }
      break;
  }
  res.send({
    buyOrderBook: buyOrderBook,
    sellOrderBook: sellOrderBook
  });
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
