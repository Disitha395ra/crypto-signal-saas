import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PLAN_RULES = {
  "1 Month": {
    pairs: 3,
    analytics: "basic"
  },
  "6 Months": {
    pairs: 6,
    analytics: "advanced"
  },
  "Annual": {
    pairs: Infinity,
    analytics: "premium"
  }
};

const ALL_SYMBOLS = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "SOLUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
];

export default function SignalsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const subscription = location.state?.subscription;

  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!subscription) {
      navigate("/dashboard");
      return;
    }

    // 🔮 Mock ML signals for all symbols (later replace with FastAPI call)
    const mockSignals = [
      { symbol: "BTCUSDT", action: "BUY", confidence: 82, price: 45234.50, change: 2.5 },
      { symbol: "ETHUSDT", action: "SELL", confidence: 74, price: 2456.80, change: -1.8 },
      { symbol: "BNBUSDT", action: "BUY", confidence: 69, price: 312.45, change: 3.2 },
      { symbol: "SOLUSDT", action: "HOLD", confidence: 58, price: 98.75, change: 0.5 },
      { symbol: "XRPUSDT", action: "BUY", confidence: 77, price: 0.5234, change: 4.1 },
      { symbol: "ADAUSDT", action: "SELL", confidence: 71, price: 0.4512, change: -2.3 },
      { symbol: "DOGEUSDT", action: "HOLD", confidence: 62, price: 0.0845, change: 1.2 },
      { symbol: "AVAXUSDT", action: "BUY", confidence: 84, price: 36.78, change: 5.6 }
    ];

    setTimeout(() => {
      setSignals(mockSignals);
      setLoading(false);
    }, 800);
  }, [subscription, navigate]);

  if (!subscription) return null;

  const rules = PLAN_RULES[subscription];
  const allowedPairs = rules.pairs === Infinity ? signals.length : rules.pairs;
  const displayedSignals = signals.slice(0, allowedPairs);
  const lockedSignals = signals.slice(allowedPairs);

  const getActionColor = (action) => {
    switch(action) {
      case "BUY": return "text-green-500";
      case "SELL": return "text-red-500";
      case "HOLD": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getActionBg = (action) => {
    switch(action) {
      case "BUY": return "bg-green-950/20 border-green-500";
      case "SELL": return "bg-red-950/20 border-red-500";
      case "HOLD": return "bg-yellow-950/20 border-yellow-500";
      default: return "bg-gray-900 border-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading trading signals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">ML Trading Signals</h1>
              <p className="text-sm text-gray-400">AI-powered predictions based on your subscription</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-gray-500">Active Plan</p>
                <p className="text-lg font-bold text-blue-500">{subscription}</p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors text-sm font-semibold uppercase tracking-wider"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="border-l-2 border-blue-500 pl-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Available Pairs</p>
              <p className="text-2xl font-bold text-white">
                {rules.pairs === Infinity ? "∞" : rules.pairs} / {ALL_SYMBOLS.length}
              </p>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Analytics Level</p>
              <p className="text-2xl font-bold text-white uppercase">{rules.analytics}</p>
            </div>
            <div className="border-l-2 border-yellow-500 pl-4">
              <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Active Signals</p>
              <p className="text-2xl font-bold text-white">{displayedSignals.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Unlocked Signals */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider">Your Trading Signals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedSignals.map((signal, i) => (
              <div
                key={i}
                className={`border ${getActionBg(signal.action)} p-6 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">{signal.symbol}</h3>
                    <p className="text-sm text-gray-400">${signal.price.toLocaleString()}</p>
                  </div>
                  <div className={`px-3 py-1 bg-black/50 border ${
                    signal.change >= 0 ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'
                  } text-sm font-semibold`}>
                    {signal.change >= 0 ? '+' : ''}{signal.change}%
                  </div>
                </div>

                <div className="mb-4">
                  <p className={`text-4xl font-bold ${getActionColor(signal.action)}`}>
                    {signal.action}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Confidence</span>
                    <span className="font-bold text-white">{signal.confidence}%</span>
                  </div>
                  <div className="bg-gray-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        signal.confidence >= 75 ? 'bg-green-500' : 
                        signal.confidence >= 60 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${signal.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {rules.analytics === "advanced" || rules.analytics === "premium" ? (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <p className="text-xs text-gray-400 mb-2">Advanced Analytics</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="px-2 py-1 bg-gray-800 text-gray-400">RSI: 65</span>
                      <span className="px-2 py-1 bg-gray-800 text-gray-400">MACD: +</span>
                      {rules.analytics === "premium" && (
                        <span className="px-2 py-1 bg-blue-900 text-blue-400">ML: 8.2</span>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* Locked Signals (if any) */}
        {lockedSignals.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Upgrade to Unlock More</h2>
              <button
                onClick={() => navigate("/subscription")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold uppercase tracking-wider transition-colors"
              >
                Upgrade Plan
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedSignals.map((signal, i) => (
                <div
                  key={i}
                  className="border border-gray-800 bg-gray-900/50 p-6 relative overflow-hidden"
                >
                  {/* Blur Overlay */}
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/60 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <p className="text-sm font-semibold text-gray-400">Upgrade to unlock</p>
                    </div>
                  </div>

                  {/* Blurred Content */}
                  <div className="opacity-40">
                    <h3 className="text-2xl font-bold text-white mb-2">{signal.symbol}</h3>
                    <p className={`text-3xl font-bold ${getActionColor(signal.action)} mb-4`}>
                      {signal.action}
                    </p>
                    <p className="text-sm text-gray-400">Confidence: {signal.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Info */}
        <div className="mt-12 border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-8">
          <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Analytics Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className={`p-4 border ${
              rules.analytics === "basic" ? "border-blue-500 bg-blue-950/20" : "border-gray-800 bg-black"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Basic</span>
                {rules.analytics === "basic" && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1">YOUR PLAN</span>
                )}
              </div>
              <ul className="space-y-1 text-gray-400">
                <li>• Real-time signals</li>
                <li>• Confidence scores</li>
                <li>• Price tracking</li>
              </ul>
            </div>
            <div className={`p-4 border ${
              rules.analytics === "advanced" ? "border-blue-500 bg-blue-950/20" : "border-gray-800 bg-black"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Advanced</span>
                {rules.analytics === "advanced" && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1">YOUR PLAN</span>
                )}
              </div>
              <ul className="space-y-1 text-gray-400">
                <li>• Everything in Basic</li>
                <li>• RSI indicators</li>
                <li>• MACD analysis</li>
              </ul>
            </div>
            <div className={`p-4 border ${
              rules.analytics === "premium" ? "border-blue-500 bg-blue-950/20" : "border-gray-800 bg-black"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white">Premium</span>
                {rules.analytics === "premium" && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-1">YOUR PLAN</span>
                )}
              </div>
              <ul className="space-y-1 text-gray-400">
                <li>• Everything in Advanced</li>
                <li>• ML predictions</li>
                <li>• Custom algorithms</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}