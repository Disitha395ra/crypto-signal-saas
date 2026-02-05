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

  useEffect(() => {
    let timer;

    const fetchData = async () => {
      try {
        // ⏳ WAIT until Firebase auth is ready
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();

        const res = await axios.get(
          `http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = res.data;

        setChartData({
          labels: data.map(d =>
            new Date(d.open_time).toLocaleTimeString()
          ),
          datasets: [
            {
              label: "Price",
              data: data.map(d => d.close),
              borderWidth: 2,
              tension: 0.3,
            },
            {
              label: "EMA 9",
              data: data.map(d => d.ema9),
              borderDash: [5, 5],
            },
            {
              label: "EMA 21",
              data: data.map(d => d.ema21),
              borderDash: [2, 2],
            },
            {
              label: "Decision",
              data: data.map(d => (d.signal ? d.close : null)),
              pointRadius: 9,
              pointBackgroundColor: data.map(d =>
                d.signal === "BUY"
                  ? "green"
                  : d.signal === "SELL"
                  ? "red"
                  : "gray"
              ),
              showLine: false,
            },
          ],
        });
      } catch (err) {
        console.error("Chart fetch error:", err);
      }
    };

    fetchData();
    timer = setInterval(fetchData, 5000);

    return () => clearInterval(timer);
  }, [symbol, duration]);

  if (!chartData) return <p>Loading chart…</p>;

  return <Line data={chartData} />;
}
