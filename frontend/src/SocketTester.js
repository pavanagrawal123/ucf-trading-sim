import { io } from 'socket.io-client';

function SocketTester() {
  const socket = io('https://5ad4-128-62-36-52.ngrok.io');

  socket.on('connect', () => {
      console.log("CONNECt");
    console.log(socket.id);
  });
  socket.on('disconnect', () => {
    console.log(socket.id);
  });

  return (
    <div>
      <h1>Hello!</h1>
    </div>
  );
}

export default SocketTester;
