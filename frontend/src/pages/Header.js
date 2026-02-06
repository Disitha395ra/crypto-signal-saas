import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-800 bg-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand Name - Left */}
          <div 
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">TB</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              TradeBuddy
            </span>
          </div>

          {/* Login Button - Right */}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-colors font-semibold uppercase tracking-wider text-sm"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}