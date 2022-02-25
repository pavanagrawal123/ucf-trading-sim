const express = require('express')
const app = express()
const port = 3000
require("google-closure-library");
goog.require("goog.structs.PriorityQueue") 

var buyOrderBook = new goog.structs.PriorityQueue();
var sellOrderBook = new goog.structs.PriorityQueue();
var PNLs = {};
var Positions = {};


function addPosition(person, quantity, price, sign) {
    if (!Positions[person]) {
        Positions[person] = {
            "position":sign*quantity,
            "cash":-sign*price*quantity,
            "orders":[]
        };
    }else{
        Position[person].position+=sign*quantity;
        Position[person].cash-=sign*price*quantity;
    }

    Positions[person].orders.push({
        price,quantity
    });
    
}

function matchOrders() {
    if (-buyOrderBook.peekKey() >= sellOrderBook.peekKey()) {
        const buyOrder = buyOrderBook.peek();
        const sellOrder = sellOrderBook.peek();
        if(buyOrder.quantity == sellOrder.quantity){
            addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1)
            addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1)
            buyOrderBook.dequeue();
            sellOrderBook.dequeue();
        }else if(buyOrder.quantity > sellOrder.quantity){
            addPosition(sellOrder.person, sellOrder.quantity, buyOrder.price, -1);
            addPosition(buyOrder.person, sellOrder.quantity, buyOrder.price, 1);
            sellOrderBook.dequeue();
            buyOrder.quantity -= sellOrder.quantity;
        }else{
            addPosition(buyOrder.person, buyOrder.quantity, buyOrder.price, 1);
            addPosition(sellOrder.person, buyOrder.quantity, buyOrder.price, -1);
            buyOrderBook.dequeue();
            sellOrder.quantity -= buyOrder.quantity;
        }
        
        matchOrders();
    }
}

app.use(express.json());

app.post('/order', (req, res) => {
    const {price, type, person, quantity} = req.body;
    switch (type) {
        case "BUY": 
            buyOrderBook.enqueue(-price, {price, quantity, person});
        break
        case "SELL":
            sellOrderBook.enqueue(price, {price, quantity, person});
    }
    matchOrders();
    res.send({bestBid: buyOrderBook.peekKey(), bestAsk: sellOrderBook.peekKey(), Positions});
    
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})