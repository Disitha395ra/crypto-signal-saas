import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../services/firebase";
import { useNavigate } from "react-router-dom";

const PLANS = [
  {
    name: "1 Month",
    price: 10,
    billing: "monthly",
    trial: "1 week free",
    features: [
      "Up to 3 trading pairs",
      "Real-time trading signals",
      "Buy/Sell/Hold indicators",
      "Email notifications",
      "Basic market analysis",
      "Mobile access"
    ],
    recommended: false
  },
  {
    name: "6 Months",
    price: 50,
    billing: "6-month",
    trial: "1 week free",
    features: [
      "Up to 6 trading pairs",
      "Advanced signal alerts",
      "Priority support",
      "Historical data access",
      "Custom watchlists",
      "SMS notifications",
      "Advanced analytics"
    ],
    recommended: true
  },
  {
    name: "Annual",
    price: 90,
    billing: "yearly",
    trial: "Extra benefits",
    features: [
      "Unlimited trading pairs",
      "Premium signal accuracy",
      "1-on-1 strategy sessions",
      "API access",
      "Portfolio analytics",
      "Exclusive market insights",
      "Early signal access",
      "Premium ML predictions"
    ],
    recommended: false
  }
];

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("6 Months");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || !currentUser.emailVerified) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsub();
  }, [navigate]);

  const handleProceed = () => {
    const plan = PLANS.find(p => p.name === selectedPlan);
    
    console.log("Selected Plan:", selectedPlan);

    // Navigate to payment form
    navigate("/PaymentForm", {
      state: {
        plan: plan
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Choose Your Subscription</h1>
              <p className="text-sm text-gray-400">Select a plan that fits your trading needs</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500">Logged in as</p>
              <p className="text-sm text-white">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Info Banner */}
        <div className="border border-blue-500 bg-blue-950/20 p-6 mb-12">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-white font-bold mb-1">Start with a Free Trial</h3>
              <p className="text-gray-400 text-sm">All plans include a 1-week free trial. No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={`border cursor-pointer transition-all duration-300 p-8 relative flex flex-col justify-between ${
                selectedPlan === plan.name
                  ? plan.recommended
                    ? "border-blue-500 bg-gradient-to-b from-blue-950/20 to-black shadow-lg shadow-blue-500/20"
                    : "border-blue-500 bg-gradient-to-b from-gray-900 to-black shadow-lg"
                  : "border-gray-800 bg-black hover:border-gray-600"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs uppercase tracking-wider px-4 py-1 font-semibold">
                  Most Popular
                </div>
              )}

              {selectedPlan === plan.name && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">{plan.trial}</p>
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-500 ml-2">/{plan.billing === "monthly" ? "mo" : plan.billing === "6-month" ? "6mo" : "yr"}</span>
                  </div>
                  {plan.billing !== "monthly" && (
                    <p className="text-xs text-green-500">
                      Save ${(plan.name === "6 Months" ? 10 : 30)} compared to monthly
                    </p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`text-center py-2 font-semibold text-sm ${
                selectedPlan === plan.name 
                  ? "text-blue-400" 
                  : "text-gray-600"
              }`}>
                {selectedPlan === plan.name ? "✓ Selected" : "Click to Select"}
              </div>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="border border-gray-800 bg-gradient-to-r from-gray-900 to-black p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right hidden md:block">
                <p className="text-xs uppercase tracking-wider text-gray-500">Selected Plan</p>
                <p className="text-lg font-bold text-white">{selectedPlan}</p>
              </div>
              <button
                onClick={handleProceed}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold uppercase tracking-wider transition-colors flex items-center space-x-2"
              >
                <span>Proceed to Payment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="border border-gray-800 bg-black p-6">
            <svg className="w-8 h-8 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="font-bold text-white mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-400">256-bit SSL encryption</p>
          </div>
          <div className="border border-gray-800 bg-black p-6">
            <svg className="w-8 h-8 text-blue-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <h3 className="font-bold text-white mb-1">Cancel Anytime</h3>
            <p className="text-sm text-gray-400">No long-term commitment</p>
          </div>
          <div className="border border-gray-800 bg-black p-6">
            <svg className="w-8 h-8 text-yellow-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-white mb-1">Money-Back Guarantee</h3>
            <p className="text-sm text-gray-400">30-day refund policy</p>
          </div>
        </div>
      </div>
    </div>
  );
}