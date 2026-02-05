import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../services/firebase";

export default function Analytics({ symbol, duration }) {
  const [summary, setSummary] = useState({ buy: 0, sell: 0, hold: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const res = await axios.get(
          `http://127.0.0.1:8000/signals/${symbol}?interval=${duration}&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = res.data;

        const counts = { buy: 0, sell: 0, hold: 0 };
        data.forEach(d => {
          if (d.signal === "BUY") counts.buy++;
          else if (d.signal === "SELL") counts.sell++;
          else counts.hold++;
        });
        setSummary(counts);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setLoading(false);
      }
    };

    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 5000);

    return () => clearInterval(intervalId);
  }, [symbol, duration]);

  const total = summary.buy + summary.sell + summary.hold;
  const buyPercent = total > 0 ? ((summary.buy / total) * 100).toFixed(1) : 0;
  const sellPercent = total > 0 ? ((summary.sell / total) * 100).toFixed(1) : 0;
  const holdPercent = total > 0 ? ((summary.hold / total) * 100).toFixed(1) : 0;

  // Determine market sentiment
  const getMarketSentiment = () => {
    if (summary.buy > summary.sell && summary.buy > summary.hold) {
      return { text: "BULLISH", color: "text-green-500", bg: "bg-green-950/30", border: "border-green-500" };
    } else if (summary.sell > summary.buy && summary.sell > summary.hold) {
      return { text: "BEARISH", color: "text-red-500", bg: "bg-red-950/30", border: "border-red-500" };
    } else {
      return { text: "NEUTRAL", color: "text-gray-500", bg: "bg-gray-900", border: "border-gray-500" };
    }
  };

  const sentiment = getMarketSentiment();

  if (loading) {
    return (
      <div className="border border-gray-800 bg-black p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400 text-sm">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Sentiment Card */}
      <div className={`border ${sentiment.border} ${sentiment.bg} p-6`}>
        <div className="text-center">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">Market Sentiment</div>
          <div className={`text-3xl font-bold ${sentiment.color} mb-1`}>{sentiment.text}</div>
          <p className="text-xs text-gray-500">Based on last {total} signals</p>
        </div>
      </div>

      {/* Signal Summary Card */}
      <div className="border border-gray-800 bg-black p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider">Signal Distribution</h2>
          {lastUpdate && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-500">
                {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* BUY Signal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span className="text-sm font-semibold text-white uppercase tracking-wider">BUY</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-500">{summary.buy}</span>
                <span className="text-xs text-gray-500 ml-2">({buyPercent}%)</span>
              </div>
            </div>
            <div className="bg-gray-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 h-full transition-all duration-500" 
                style={{ width: `${buyPercent}%` }}
              ></div>
            </div>
          </div>

          {/* SELL Signal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                <span className="text-sm font-semibold text-white uppercase tracking-wider">SELL</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-red-500">{summary.sell}</span>
                <span className="text-xs text-gray-500 ml-2">({sellPercent}%)</span>
              </div>
            </div>
            <div className="bg-gray-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-red-500 h-full transition-all duration-500" 
                style={{ width: `${sellPercent}%` }}
              ></div>
            </div>
          </div>

          {/* HOLD Signal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-3"></div>
                <span className="text-sm font-semibold text-white uppercase tracking-wider">HOLD</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-gray-400">{summary.hold}</span>
                <span className="text-xs text-gray-500 ml-2">({holdPercent}%)</span>
              </div>
            </div>
            <div className="bg-gray-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gray-500 h-full transition-all duration-500" 
                style={{ width: `${holdPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Count */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Total Signals Analyzed</div>
          <div className="text-3xl font-bold text-white">{total}</div>
        </div>
      </div>

      {/* Signal Strength Indicator */}
      <div className="border border-gray-800 bg-gradient-to-br from-gray-900 to-black p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Signal Strength</h3>
        <div className="space-y-3 text-sm">
          {summary.buy > summary.sell * 2 && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <div>
                <div className="text-white font-semibold mb-1">Strong Uptrend</div>
                <div className="text-gray-400">Buy signals dominating the market</div>
              </div>
            </div>
          )}
          {summary.sell > summary.buy * 2 && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <div>
                <div className="text-white font-semibold mb-1">Strong Downtrend</div>
                <div className="text-gray-400">Sell signals dominating the market</div>
              </div>
            </div>
          )}
          {summary.hold > summary.buy && summary.hold > summary.sell && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
              <div>
                <div className="text-white font-semibold mb-1">Market Consolidation</div>
                <div className="text-gray-400">Wait for clearer signals to emerge</div>
              </div>
            </div>
          )}
          {Math.abs(summary.buy - summary.sell) < 2 && summary.hold < total / 2 && (
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <div className="text-white font-semibold mb-1">Mixed Signals</div>
                <div className="text-gray-400">Market direction uncertain, exercise caution</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auto-refresh Notice */}
      <div className="border border-gray-800 bg-black p-4">
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Data refreshes every 5 seconds</span>
        </div>
      </div>
    </div>
  );
}