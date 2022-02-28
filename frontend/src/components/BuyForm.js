import React from 'react';
import TextField from '@mui/material/Button';
import { Button } from '@mui/material';
import { useState } from 'react';

var numBids = 0;
var numAsks = 0;
const serverStr = 'https://9c9f-128-62-33-76.ngrok.io';

const BuyForm = () => {
  const [price, setPrice] = useState(0);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const onSubmitBid = (e) => {
    e.preventDefault();

    if (!price) {
      alert('Please specify a price');
      return;
    }

    var type = 'BUY';
    console.log('buy');

    onAdd({ price: price, person: name, type: type, quantity: quantity });

    setPrice(0);
  };

  const onSubmitAsk = (e) => {
    e.preventDefault();

    if (!price) {
      alert('Please specify a price');
      return;
    }

    var type = 'SELL';
    console.log('sell');

    onAdd({ price: price, person: name, type: type, quantity: quantity });

    setPrice(0);
  };

  return (
    <div className='w-screen mt-5 h-full'>
      <div className='mx-10 bg-white rounded-xl h-36 flex flex-col justify-center'>
        <div className='flex flex-row w-full py-2 px-5 justify-around'>
          <div className=''>
            <label>Name</label>
            <input
              className='border-2 rounded-lg'
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className=''>
            <label>Price</label>
            <input
              className='border-2 rounded-lg'
              type='number'
              placeholder='Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className=''>
            <label>Quantity</label>
            <input
              className='border-2 rounded-lg'
              type='number'
              placeholder='Quantity'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className='flex flex-col justify-start h-full'>
            <button
              onClick={onSubmitBid}
              className='bg-green-400 py-2 px-10 rounded'
            >
              Place Bid
            </button>
            <div className='py-2'></div>
            <button
              onClick={onSubmitAsk}
              className='bg-red-400 py-2 px-10 rounded'
            >
              Place Ask{' '}
            </button>
          </div>
        </div>
      </div>
    </div>
    // <div>
    //     <h2>Orders:</h2>
    //     {/* <TextField id="outlined-basic" label="Outlined" variant="filled" size="large"/> */}

    //     <form>
    //         <p>Name:</p>
    //         <input type="text" id = "nameInput"/>
    //         <p>Price:</p>
    //         <input type="text" id = "priceInput"/>
    //         {/* <input type="text" id = "nameInput"/> */}
    //         <br></br>
    //         <Button variant = "contained" onClick="buyOrder()" id="BidButton">Buy</Button>
    //         <Button variant = "contained" onClick="sellOrder()" id="AskButton">Sell</Button>
    //     </form>

    // </div>
  );
};

const onAdd = async (task) => {
  const res = await fetch('http://localhost:4000/order', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  const data = await res.json();
  console.log(JSON.stringify(task));

  // setTasks([...tasks, data])
};

const buyOrder = (price) => {
  const bid = {
    id: numBids,
    price: parseFloat(price),
  };
  const jsonBid = JSON.stringify(bid);
  // print("bid done");
  // numBids++;
  // let jsonFile = require('jsonfile');
  // jsonFile.writeFile('bids.json', jsonBid);
};

const sellOrder = (price) => {
  const ask = {
    id: numAsks,
    price: parseFloat(price),
  };
  const jsonAsk = JSON.stringify(ask);
  // print("sell done");
  // numBids++;
  // let jsonFile = require('jsonfile');
  // jsonFile.writeFile('bids.json', jsonBid);
};

export default BuyForm;
