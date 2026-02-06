import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import Charts from "./Charts";
import axios from "axios";

const SYMBOL_LIMITS = {
  "1 Month": 3,
  "6 Months": 6,
  "Annual": Infinity,
};

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
  const [fetchingSignal, setFetchingSignal] = useState(false);

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
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await axios.get(
          `http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setChartData(res.data);
        setAnalyticsData(res.data);
      } catch {
        setChartData([]);
        setAnalyticsData([]);
      }
    };

    fetchData();
  }, [symbol, duration]);

  const handleEarnClick = () => {
    if (!subscription?.status || subscription.status !== "active") {
      navigate("/subscribe");
    } else {
      navigate("/signals");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400">
        Loading dashboard...
      </div>
    );
  }

  if (!user || !subscription) return null;

  return (
    <div className="min-h-screen bg-black text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900 px-6 py-4 flex justify-between">
        <div>
          <h1 className="text-xl font-bold">Trading Dashboard</h1>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-800 px-4 py-2 text-sm"
        >
          Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center bg-gray-900 p-6 border border-gray-800">
          <div className="text-lg font-semibold">
            {symbol} | {duration}
          </div>

          <button
            onClick={handleEarnClick}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold uppercase tracking-wider"
          >
            Earn money using our signals
          </button>
        </div>

        {/* Charts */}
        {chartData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border border-gray-800 p-6">
              <Charts data={chartData} symbol={symbol} duration={duration} />
            </div>
            <Analytics data={analyticsData} symbol={symbol} duration={duration} />
          </div>
        )}
      </div>
    </div>
  );
}
