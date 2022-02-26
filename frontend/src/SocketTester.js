import { io } from "socket.io-client";
import { useEffect } from 'react';

function SocketTester() {

  useEffect(() => {
    const socket = io('https://a5d2-128-62-76-13.ngrok.io/');
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('disconnect', () => {
      console.log(socket.id);
    });

    socket.on('orderMatched', (transaction) => {
      console.log('MATHCED!');
      console.log(transaction);
    });

    socket.on('tickPrice', (price) => {
      console.log('WOW PriCe' + price.price);
    });
  }, []);


  return (
    <div>
      <h1>Hello!</h1>
    </div>
  );
}

export default SocketTester;
