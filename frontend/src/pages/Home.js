// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

const subscriptions = [
  { id: 1, name: "1 Month", price: 10, trial: "1 week free" },
  { id: 6, name: "6 Months", price: 50, trial: "1 week free" },
  { id: 12, name: "Annual", price: 90, trial: "Extra benefits" },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (plan) => {
    // Navigate to Signup page and pass selected plan
    navigate("/signup", { state: { plan } });       //User plan එක select කරනවා
                                                    //ඒ select කරපු plan එක
                                                    // state කියන object එකක් ඇතුළේ
                                                    // Signup page එකට යවලා තියෙනවා
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Choose Your Subscription</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="border p-6 rounded-lg shadow-lg flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-bold mb-2">{sub.name}</h2>
              <p className="mb-2">{sub.trial}</p>
              <p className="text-lg font-semibold">${sub.price}</p>
            </div>
            <button
              onClick={() => handleSelect(sub)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
