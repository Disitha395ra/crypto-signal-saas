import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "1 Month",
    price: 10,
    features: [
      "Up to 3 trading pairs",
      "Real-time signals",
      "Basic analytics"
    ]
  },
  {
    name: "6 Months",
    price: 45,
    features: [
      "Up to 6 trading pairs",
      "Advanced analytics",
      "Higher accuracy signals"
    ]
  },
  {
    name: "Annual",
    price: 80,
    features: [
      "Unlimited trading pairs",
      "Premium ML predictions",
      "Highest accuracy signals"
    ]
  }
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("1 Month");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.emailVerified) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    });

    return () => unsub();
  }, [navigate]);

  const handleProceed = () => {
    // STEP 3: Stripe checkout will come here
    console.log("Selected Plan:", selectedPlan);

    // temporary navigation
    navigate("/payment", {
      state: {
        plan: selectedPlan
      }
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4">
        <h1 className="text-2xl font-bold">Choose Your Subscription</h1>
        <p className="text-sm text-gray-400">{user.email}</p>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`border p-6 cursor-pointer transition-all
              ${selectedPlan === plan.name
                ? "border-blue-500 bg-gray-900"
                : "border-gray-800 bg-black hover:border-gray-600"}`}
            onClick={() => setSelectedPlan(plan.name)}
          >
            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-3xl font-extrabold mb-4">${plan.price}</p>

            <ul className="space-y-2 text-sm text-gray-400 mb-6">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            {selectedPlan === plan.name && (
              <div className="text-blue-500 text-sm font-semibold">
                Selected Plan
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action */}
      <div className="max-w-6xl mx-auto px-6 pb-12 flex justify-between items-center border-t border-gray-800 pt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-400 hover:text-white"
        >
          ← Back to Dashboard
        </button>

        <button
          onClick={handleProceed}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold uppercase tracking-wider"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}
