import "./App.css";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

function OrderBook({data}) {
  const buyOrders = data ? data.buyOrderBook : [
    {
      price: 1,
      quantity: 100,
    },
    { price: 2, quantity: 500 },
  ];

  const sellorders = data ? data.sellOrderBook :[
    {
      price: 5,
      quantity: 100,
    },
    {
      price: 6,
      quantity: 100,
    },
  ];

  return (
    <>
      <List>
        {buyOrders.map((order) => {
          return (
            <>
              <ListItemText primary={`$${order.price} - ${order.quantity}`} />
            </>
          );
        })}
      </List>
      <List>
      {sellorders.map((order) => {
          return (
            <>
              <ListItemText primary={`$${order.price} - ${order.quantity}`} />
            </>
          );
        })}
      </List>
    </>
  );
}

export default OrderBook;
