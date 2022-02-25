import { io } from "socket.io-client";
import { useEffect } from 'react';

function SocketTester() {

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log(socket.id);
    });
    socket.on('disconnect', () => {
      console.log(socket.id);
    });
  }, []);


  return (
    <div>
      <h1>Hello!</h1>
    </div>
  );
}

export default SocketTester;
