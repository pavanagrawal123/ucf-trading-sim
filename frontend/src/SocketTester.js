import { io } from "socket.io-client";
import { useEffect } from 'react';

function SocketTester() {

  useEffect(() => {
    const socket = io('https://9c9f-128-62-33-76.ngrok.io');
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
