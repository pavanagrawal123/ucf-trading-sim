import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import './App.css';
import moment from "moment";
import 'chartjs-plugin-streaming';

import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';

import { Chart, Line } from 'react-chartjs-2';
import faker from 'faker';

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
  scales: {
    x: {
        display: true,
        type: "realtime",
        distribution: "linear",
        realtime: {
          onRefresh: function (chart) {
            chart.data.datasets[0].data.push({
              x: moment(),
              y: Math.random()
            });
          },
          delay: 3000,
          time: {
            displayFormat: "h:mm"
          }
        },
        ticks: {
          displayFormats: 1,
          maxRotation: 0,
          minRotation: 0,
          stepSize: 1,
          maxTicksLimit: 30,
          minUnit: "second",
          source: "auto",
          autoSkip: true,
          callback: function (value) {
            return moment(value, "HH:mm:ss").format("mm:ss");
          }
        }
    },
    y: {
        display: true,
        ticks: {
          beginAtZero: true,
          max: 1
        }
    }
  }
};

const labels = [];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    
  ],
};

export function addData(chart, data) {
  chart.data.labels.push();
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(3);
  });
  chart.update();
}

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      <header className="app-header">
        UCF Trading Sim
      </header>
      { socket ? (
        <div className="chat-container">
          <Messages socket={socket} />
          <MessageInput socket={socket} />
        </div>
      ) : (
        <div>Not Connected</div>
      )}
      <Line options={options} data={data} />;

      </div>
  );
}

export default App;