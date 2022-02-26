import React from 'react';
import TextField from '@mui/material/Button';
import { Button } from '@mui/material';
import { useState } from 'react';

var numBids = 0;
var numAsks = 0;
const serverStr = "https://9c9f-128-62-33-76.ngrok.io";

const BuyForm = () => {


    const [price, setPrice] = useState(0)
    const [name, setName] = useState("")
    const [bid, setBid] = useState(false)
    const [ask, setAsk] = useState(false)
    const [quantity, setQuantity] = useState(1)
  
    const onSubmit = (e) => {
      e.preventDefault()
  
      if (!price) {
        alert('Please specify a price')
        return
      }
  
      if(!(ask ? !bid : bid)){
        alert('Must be either bid or ask')
        return
      }
  
      var type = ask ? 'SELL' : 'BUY'
      
      onAdd({ price: price, person: name, type: type, quantity: quantity})
  
      setPrice(0)
    }  

  return (
    <form className='add-form' onSubmit={onSubmit}>
        <div className='form-control'>
        <label>Name</label>
        <input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        </div>
        <div className='form-control'>
        <label>Price</label>
        <input
            type='number'
            placeholder='Price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
        />
        </div>
        <div className='form-control'>
        <label>Quantity</label>
        <input
            type='number'
            placeholder='Quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
        />
        </div>
        <div className='form-control form-control-check'>
        <label>Bid?</label>
        <input
            type='checkbox'
            placeholder = 'Bid'
            checked={bid}
            value={bid}
            onChange={(e) => setBid(e.currentTarget.checked)}
        />
        </div>
        <div className='form-control form-control-check'>
        <label>Ask?</label>
        <input
            type='checkbox'
            placeholder = 'Ask'
            checked={ask}
            value={ask}
            onChange={(e) => setAsk(e.currentTarget.checked)}
        />
        </div>
        <input type='submit' value='Make Bid!!!!' className='btn btn-block' />
    </form>
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
  )
}

const onAdd = async (task) => {
    const res = await fetch("https://9c9f-128-62-33-76.ngrok.io", {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task)
    })

    const data = await res.json()
    console.log(JSON.stringify(task));

    // setTasks([...tasks, data])

 
  }


     


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
}

const sellOrder = (price) => {
    const ask = {
        id: numAsks,
        price: parseFloat(price)
    };
    const jsonAsk = JSON.stringify(ask);
    // print("sell done");
    // numBids++;
    // let jsonFile = require('jsonfile');
    // jsonFile.writeFile('bids.json', jsonBid);
}

export default BuyForm