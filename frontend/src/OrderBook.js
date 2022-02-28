import './App.css';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

function OrderBook({ data }) {
  const buyOrders = data
    ? data.buyOrderBook
    : [
        {
          price: 1,
          quantity: 100,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        {
          price: 2,
          quantity: 500,
        },
        
        {
          price: 2,
          quantity: 500,
        },
        
        {
          price: 2,
          quantity: 500,
        },
        
        {
          price: 2,
          quantity: 500,
        },
        
      ];

  const sellorders = data
    ? data.sellOrderBook
    : [
        {
          price: 5,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        {
          price: 6,
          quantity: 100,
        },
        
      ];

  return (
    <div className='bg-white rounded-xl h-full'>
      {/* <p className='text-center text-lg pt-2'>Order Book</p> */}
      <div className='h-[49%] pt-2 overflow-y-auto'>
        <p className='text-center text-green-500 text-lg pb-2'>Bids</p>
        <div className=''>
          <p className='ml-2'>
            Price &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Quantity
          </p>
          <List>
            {buyOrders.map((order, index) => {
              const bgColor = index % 2 === 1 ? 'bg-white' : 'bg-slate-200';
              return (
                <div className={`${bgColor}`}>
                  <div className='ml-2 py-1'>
                    <p>
                      {' '}
                      ${order.price} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp; &nbsp; &nbsp;
                      {order.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </List>
        </div>
      </div>
      <div className='h-[2%]'>
        <div className="pt-3 border-b-[1px] border-slate-300 h-0 w-full"> </div> 
      </div>
      <div className='h-[49%] overflow-y-auto'>
        <p className='text-center text-red-500 text-lg pb-2'>Asks</p>
        <div className=''>
          <p className='ml-2'>
            Price &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;Quantity
          </p>
          <List>
            {sellorders.map((order, index) => {
              const bgColor = index % 2 === 1 ? 'bg-white' : 'bg-slate-200';
              return (
                <div className={`${bgColor}`}>
                  <div className='ml-2 py-1'>
                    <p>
                      {' '}
                      ${order.price} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                      &nbsp; &nbsp; &nbsp;
                      {order.quantity}
                    </p>
                  </div>
                </div>
              );
            })}
          </List>
        </div>
      </div>
    </div>
  );
}

export default OrderBook;
