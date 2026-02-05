import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../services/firebase";

export default function Analytics({ symbol, duration }) {
  const [summary, setSummary] = useState({ buy: 0, sell: 0, hold: 0 });

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(`http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=10`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;

        const counts = { buy: 0, sell: 0, hold: 0 };
        data.forEach(d => {
          if (d.signal === "BUY") counts.buy++;
          else if (d.signal === "SELL") counts.sell++;
          else counts.hold++;
        });
        setSummary(counts);
      } catch (err) {
        console.error(err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [symbol, duration]);

  return (
    <div className="p-4 border rounded space-y-2">
      <h2 className="font-bold">Signal Summary</h2>
      <p>BUY: <span className="text-green-600">{summary.buy}</span></p>
      <p>SELL: <span className="text-red-600">{summary.sell}</span></p>
      <p>HOLD: <span className="text-gray-600">{summary.hold}</span></p>
    </div>
  );
}
