// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

const subscriptions = [
  { 
    id: 1, 
    name: "1 Month", 
    price: 10, 
    trial: "1 week free",
    features: [
      "Real-time trading signals",
      "Buy/Sell/Hold indicators",
      "Email notifications",
      "Basic market analysis",
      "Mobile access"
    ],
    recommended: false
  },
  { 
    id: 6, 
    name: "6 Months", 
    price: 50, 
    trial: "1 week free",
    features: [
      "Everything in 1 Month",
      "Advanced signal alerts",
      "Priority support",
      "Historical data access",
      "Custom watchlists",
      "SMS notifications"
    ],
    recommended: true
  },
  { 
    id: 12, 
    name: "Annual", 
    price: 90, 
    trial: "Extra benefits",
    features: [
      "Everything in 6 Months",
      "Premium signal accuracy",
      "1-on-1 strategy sessions",
      "API access",
      "Portfolio analytics",
      "Exclusive market insights",
      "Early signal access"
    ],
    recommended: false
  },
];

export default function Home() {
  const navigate = useNavigate();

  const handleSelect = (plan) => {
    navigate("/signup", { state: { plan } });
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Precision Trading
            <span className="block text-gray-500 mt-2">Signals</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Real-time market intelligence. Know exactly when to buy, sell, or hold. 
            Stop guessing. Start trading with confidence.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-8 mb-20 max-w-4xl mx-auto">
          <div className="text-center border-r border-gray-800">
            <div className="text-3xl font-bold text-white mb-1">98.2%</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Signal Accuracy</div>
          </div>
          <div className="text-center border-r border-gray-800">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Market Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">&lt;2s</div>
            <div className="text-sm text-gray-500 uppercase tracking-wider">Signal Latency</div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className={`border ${
                sub.recommended 
                  ? 'border-blue-500 bg-gradient-to-b from-blue-950/20 to-black' 
                  : 'border-gray-800 bg-black'
              } p-8 rounded-none relative flex flex-col justify-between hover:border-gray-600 transition-all duration-300`}
            >
              {sub.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs uppercase tracking-wider px-4 py-1 font-semibold">
                  Most Popular
                </div>
              )}
              
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2 text-white">{sub.name}</h2>
                  <p className="text-sm text-gray-400 uppercase tracking-wider mb-4">{sub.trial}</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-white">${sub.price}</span>
                    <span className="text-gray-500 ml-2">/{sub.id === 1 ? 'mo' : sub.id === 6 ? '6mo' : 'yr'}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {sub.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSelect(sub)}
                className={`w-full py-3 font-semibold transition-all duration-200 ${
                  sub.recommended
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-8 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-4xl font-bold text-blue-500 mb-4">01</div>
              <h3 className="text-xl font-bold mb-3 text-white">Subscribe</h3>
              <p className="text-gray-400">
                Choose your plan and activate your account. Start with a 1-week free trial - no credit card required.
              </p>
            </div>
            <div className="border border-gray-800 p-8 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-4xl font-bold text-blue-500 mb-4">02</div>
              <h3 className="text-xl font-bold mb-3 text-white">Receive Signals</h3>
              <p className="text-gray-400">
                Get instant notifications when our AI detects optimal entry and exit points in the market.
              </p>
            </div>
            <div className="border border-gray-800 p-8 bg-gradient-to-b from-gray-900 to-black">
              <div className="text-4xl font-bold text-blue-500 mb-4">03</div>
              <h3 className="text-xl font-bold mb-3 text-white">Execute Trades</h3>
              <p className="text-gray-400">
                Follow clear buy, sell, and hold recommendations. Trade with confidence backed by data.
              </p>
            </div>
          </div>
        </div>

        {/* Signal Types */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold mb-12 text-center">Signal Intelligence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 p-6 bg-black">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                <h3 className="text-lg font-bold text-white">BUY Signals</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Algorithmic detection of optimal entry points based on momentum, volume, and technical indicators.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-black">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                <h3 className="text-lg font-bold text-white">SELL Signals</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Identify peak exit opportunities before market reversals to maximize your profits.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-black">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                <h3 className="text-lg font-bold text-white">HOLD Signals</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Stay informed during consolidation phases. Know when patience pays off.
              </p>
            </div>
            <div className="border border-gray-800 p-6 bg-black">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                <h3 className="text-lg font-bold text-white">ALERT Signals</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Real-time notifications for major market movements and breaking opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border border-gray-800 p-12 bg-gradient-to-br from-gray-900 to-black text-center">
          <h2 className="text-2xl font-bold mb-6">Trusted by Active Traders</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white mb-1">12,000+</div>
              <div className="text-sm uppercase tracking-wider">Active Users</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-800"></div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white mb-1">50M+</div>
              <div className="text-sm uppercase tracking-wider">Signals Delivered</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-gray-800"></div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-white mb-1">4.8/5</div>
              <div className="text-sm uppercase tracking-wider">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}