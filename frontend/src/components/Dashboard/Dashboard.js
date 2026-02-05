import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { useNavigate } from "react-router-dom";
import Analytics from "./Analytics";
import Charts from "./Charts";

// Subscription → symbol limits
const SYMBOL_LIMITS = {
  "1 Month": 3,
  "6 Months": 6,
  "12 Months": Infinity,
};

// All supported trading pairs
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

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [allowedSymbols, setAllowedSymbols] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [duration, setDuration] = useState("5m");
  const [loading, setLoading] = useState(true);

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

        // 🔒 Apply subscription limits
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

  if (loading) return <div className="p-4">Loading dashboard...</div>;
  if (!user || !subscription) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, {user.email}
        </h1>
        <p className="text-gray-600">
          Plan: <strong>{subscription.plan}</strong>
        </p>
        <p className="text-sm text-gray-500">
          Allowed symbols: {allowedSymbols.length}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Symbol Selector (RESTRICTED) */}
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border p-2 rounded"
        >
          {allowedSymbols.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Duration Selector */}
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="1m">1 Minute</option>
          <option value="5m">5 Minutes</option>
          <option value="15m">15 Minutes</option>
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
        </select>
      </div>

      {/* Charts */}
      {symbol ? (
        <>
          <Charts symbol={symbol} duration={duration} />
          <Analytics symbol={symbol} duration={duration} />
        </>
      ) : (
        <div className="text-red-500">
          No symbols available for your plan.
        </div>
      )}
    </div>
  );
}
