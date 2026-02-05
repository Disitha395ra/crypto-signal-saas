import React from "react";
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import 'chartjs-adapter-date-fns';

// Register Chart.js & financial plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  Title,
  CandlestickController,
  CandlestickElement
);

export default function Charts({ data, symbol, duration }) {
  if (!data || data.length === 0) return <div>No chart data</div>;

  // Prepare candlestick data
  const chartData = {
    datasets: [
      {
        label: `${symbol} Candles`,
        data: data.map(d => ({
          x: new Date(d.time), // time should be timestamp in ms
          o: d.open,
          h: d.high,
          l: d.low,
          c: d.close,
        })),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: (ctx) => {
          const val = ctx.dataset.data[ctx.dataIndex];
          return val.c > val.o ? "rgba(0,200,0,0.6)" : "rgba(200,0,0,0.6)";
        },
      },
      // EMA9 overlay
      {
        label: "EMA9",
        type: "line",
        data: data.map(d => ({ x: new Date(d.time), y: d.ema9 })),
        borderColor: "blue",
        borderWidth: 1,
        tension: 0.2,
        pointRadius: 0,
      },
      // EMA21 overlay
      {
        label: "EMA21",
        type: "line",
        data: data.map(d => ({ x: new Date(d.time), y: d.ema21 })),
        borderColor: "orange",
        borderWidth: 1,
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${symbol} Candlestick Chart (${duration})`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: duration === "1d" ? "day" : "minute",
          tooltipFormat: "dd MMM yyyy HH:mm",
        },
        ticks: {
          maxRotation: 0,
        },
      },
      y: {
        position: "left",
      },
    },
  };

  return <Chart type="candlestick" data={chartData} options={options} />;
}
