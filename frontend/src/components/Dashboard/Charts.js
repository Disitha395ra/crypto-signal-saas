import React from "react";

export default function Charts({ symbol, duration }) {
  return (
    <div className="mt-4 p-4 border rounded">
      <h2 className="text-xl font-semibold">Charts</h2>
      <p>Symbol: {symbol}</p>
      <p>Duration: {duration}</p>
    </div>
  );
}
