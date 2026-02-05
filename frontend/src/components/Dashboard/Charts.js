import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { auth } from "../../services/firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Charts({ symbol, duration }) {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ⏳ WAIT until Firebase auth is ready
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();

        const res = await axios.get(
          `http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        if (!data || data.length === 0) {
          setError("No data available");
          setChartData(null);
          return;
        }

        setChartData({
          labels: data.map(d =>
            new Date(d.open_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          ),
          datasets: [
            {
              label: "Price",
              data: data.map(d => d.close),
              borderColor: "#3B82F6",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 6,
            },
            {
              label: "EMA 9",
              data: data.map(d => d.ema9),
              borderColor: "#10B981",
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderDash: [5, 5],
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: "EMA 21",
              data: data.map(d => d.ema21),
              borderColor: "#F59E0B",
              backgroundColor: "transparent",
              borderWidth: 1.5,
              borderDash: [2, 2],
              tension: 0.4,
              pointRadius: 0,
            },
            {
              label: "Signal",
              data: data.map(d => (d.signal ? d.close : null)),
              pointRadius: data.map(d => d.signal ? 8 : 0),
              pointHoverRadius: data.map(d => d.signal ? 10 : 0),
              pointBackgroundColor: data.map(d =>
                d.signal === "BUY"
                  ? "#10B981"
                  : d.signal === "SELL"
                  ? "#EF4444"
                  : "#6B7280"
              ),
              pointBorderColor: "#000000",
              pointBorderWidth: 2,
              showLine: false,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error("Chart fetch error:", err);
        setError("Failed to load chart data");
        setLoading(false);
      }
    };

    fetchData();
    timer = setInterval(fetchData, 5000);

    return () => clearInterval(timer);
  }, [symbol, duration]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#9CA3AF',
          font: {
            size: 11,
            family: 'system-ui',
          },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y.toFixed(2);
            }
            return label;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          color: '#1F2937',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: '#1F2937',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 10,
          },
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 border border-gray-800">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-400 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 border border-gray-800">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-900 border border-gray-800">
        <p className="text-gray-400">No chart data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 border border-gray-800" style={{ height: '400px' }}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}