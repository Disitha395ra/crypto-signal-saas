import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import Charts from "./Charts";
import axios from "axios";

// Subscription → symbol limits
const SYMBOL_LIMITS = {
  "1 Month": 3,
  "6 Months": 6,
  "Annual": Infinity,
};

// All supported trading pairs
const ALL_SYMBOLS = [
  "BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT",
  "XRPUSDT", "ADAUSDT", "DOGEUSDT", "AVAXUSDT"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [allowedSymbols, setAllowedSymbols] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [duration, setDuration] = useState("5m");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  // 🔐 Auth + subscription loader
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser || !currentUser.emailVerified) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          alert("User profile not found");
          navigate("/login");
          return;
        }
        const data = snap.data();
        setSubscription(data);
        const limit = SYMBOL_LIMITS[data.plan] ?? 0;
        const symbols = ALL_SYMBOLS.slice(0, limit);
        setAllowedSymbols(symbols);
        setSymbol(symbols[0] || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load subscription");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch chart & analytics data whenever symbol or duration changes
  useEffect(() => {
    if (!symbol) return;
    const fetchData = async () => {
      try {
        // Get Firebase ID token for authorization
        const token = await auth.currentUser.getIdToken();
        // Call your FastAPI backend
        const response = await axios.get(
          `http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = response.data;
        setChartData(data);
        setAnalyticsData(data); // You can process differently if needed
      } catch (err) {
        console.error("API Error:", err);
        setChartData([]);
        setAnalyticsData([]);
      }
    };
    fetchData();
  }, [symbol, duration]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-gray-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !subscription) return null;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header Bar */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Trading Dashboard</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 transition-colors text-sm font-semibold uppercase tracking-wider"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Subscription Info Card */}
        <div className="border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-l-2 border-blue-500 pl-4">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Subscription Plan</div>
              <div className="text-xl font-bold text-white">{subscription.plan}</div>
            </div>
            <div className="border-l-2 border-green-500 pl-4">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Available Symbols</div>
              <div className="text-xl font-bold text-white">{allowedSymbols.length} / {ALL_SYMBOLS.length}</div>
            </div>
            <div className="border-l-2 border-yellow-500 pl-4">
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Account Status</div>
              <div className="text-xl font-bold text-green-500">Active</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border border-gray-800 bg-black p-6">
          <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Signal Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Symbol Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Trading Pair
              </label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                {allowedSymbols.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Select cryptocurrency pair to analyze
              </p>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Time Interval
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1h">1 Hour</option>
                <option value="1d">1 Day</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Chart refresh interval for signal generation
              </p>
            </div>
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-400">Currently Analyzing:</span>
            <span className="font-bold text-white text-lg">{symbol}</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">{duration === "1m" ? "1 Minute" : duration === "5m" ? "5 Minutes" : duration === "15m" ? "15 Minutes" : duration === "1h" ? "1 Hour" : "1 Day"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Live Data</span>
          </div>
        </div>

        {/* Charts and Analytics */}
        {symbol && chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section - Takes 2 columns */}
            <div className="lg:col-span-2 border border-gray-800 bg-black p-6">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wider">Price Chart & Signals</h2>
              <Charts data={chartData} symbol={symbol} duration={duration} />
            </div>

            {/* Analytics Section - Takes 1 column */}
            <div className="lg:col-span-1">
              <Analytics data={analyticsData} symbol={symbol} duration={duration} />
            </div>
          </div>
        ) : (
          <div className="border border-red-900 bg-red-950/20 p-12 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-bold text-red-500 mb-2">No Data Available</h3>
            <p className="text-gray-400 mb-4">
              Unable to fetch trading signals for {symbol} at {duration} interval
            </p>
            <p className="text-sm text-gray-500">
              Please check your connection or try a different symbol/interval
            </p>
          </div>
        )}

        {/* Info Footer */}
        <div className="border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="font-semibold text-white">BUY Signal</span>
              </div>
              <p className="text-gray-400">Strong upward momentum detected. Consider entering position.</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="font-semibold text-white">SELL Signal</span>
              </div>
              <p className="text-gray-400">Downward trend identified. Consider exiting or shorting.</p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
                <span className="font-semibold text-white">HOLD Signal</span>
              </div>
              <p className="text-gray-400">Market consolidation. Wait for clearer direction.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}