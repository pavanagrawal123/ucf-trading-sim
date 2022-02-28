import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import './App.css';
import moment from "moment";
import 'chartjs-plugin-streaming';
import BuyForm from "./components/BuyForm"
import OrderBook from './OrderBook';

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
      text: 'Tick Chart',
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

const labels = [moment().format('LTS')];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [100,1000],
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
  const [oData, setOData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:4000`);
    setSocket(newSocket);
    newSocket.on('orderBook', (orderBook) => {
      setOData(orderBook);
    });
    newSocket.on('tickPrice', (pricing) => {
      const chart = chartRef.current;
      chart.data.labels.push(moment().format('LTS'));
      chart.data.datasets[0].data.push(pricing.price);
      chart.update();
    })
    return () => newSocket.close();
  }, [setSocket, setOData]);

  

  return (
    <div className="App">
      <header className="app-header">
        UCF Trading Sim
      </header>
      { socket ? (
        <div className="chat-container">
        </div>
      ) : (
        <div>Not Connected</div>
      )}
      <BuyForm />
      <Chart ref={chartRef} type='line' data={data} />
      <OrderBook data={oData} />
      </div>
  );
}

export default App;