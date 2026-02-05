import React from "react";
import 'chartjs-adapter-date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

export default function Analytics({ data, symbol, duration }) {
  if (!data || data.length === 0) return <div>No analytics data</div>;

  // Prepare labels (timestamps)
  const labels = data.map(d => new Date(d.time));

  // RSI Chart
  const rsiData = {
    labels,
    datasets: [
      {
        label: "RSI",
        data: data.map(d => d.rsi),
        borderColor: "purple",
        backgroundColor: "rgba(128,0,128,0.1)",
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  // MACD Chart
  const macdData = {
    labels,
    datasets: [
      {
        label: "MACD",
        data: data.map(d => d.macd),
        borderColor: "blue",
        backgroundColor: "rgba(0,0,255,0.1)",
        tension: 0.2,
        pointRadius: 0,
      },
      {
        label: "MACD Signal",
        data: data.map(d => d.macd_signal),
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.1)",
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `${symbol} Technical Indicators (${duration})`,
      },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: {
        type: "time",
        time: {
          tooltipFormat: "dd MMM yyyy HH:mm",
          unit: duration === "1d" ? "day" : "minute",
        },
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">RSI</h2>
        <Line data={rsiData} options={options} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">MACD</h2>
        <Line data={macdData} options={options} />
      </div>
    </div>
  );
}
