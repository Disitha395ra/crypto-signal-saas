import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        navigate("/dashboard");
      } else {
        alert("Please verify your email before logging in.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-0 border border-gray-800">
        {/* Left Side - Branding & Info */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-12 border-r border-gray-800 hidden md:flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Welcome Back
            </h1>
            <p className="text-gray-400 text-lg mb-12">
              Access your trading signals dashboard and stay ahead of the market
            </p>

            <div className="space-y-8">
              <div className="border-l-2 border-blue-500 pl-6">
                <h3 className="text-xl font-bold mb-2 text-white">Real-Time Signals</h3>
                <p className="text-gray-400">
                  Get instant notifications the moment our algorithms detect optimal trading opportunities in the market
                </p>
              </div>

              <div className="border-l-2 border-green-500 pl-6">
                <h3 className="text-xl font-bold mb-2 text-white">Data-Driven Decisions</h3>
                <p className="text-gray-400">
                  Every signal is backed by advanced technical analysis, volume patterns, and momentum indicators
                </p>
              </div>

              <div className="border-l-2 border-yellow-500 pl-6">
                <h3 className="text-xl font-bold mb-2 text-white">Track Your Performance</h3>
                <p className="text-gray-400">
                  Monitor your trading history, analyze patterns, and continuously improve your strategy
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">98.2%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white mb-1">&lt;2s</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">Latency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-black p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Sign In</h2>
            <p className="text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-400 cursor-pointer">
                <input type="checkbox" className="mr-2 bg-gray-900 border-gray-800" />
                Remember me
              </label>
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 font-semibold hover:bg-gray-200 transition-colors duration-200 mt-6"
            >
              Sign In
            </button>

            {/* Signup Link */}
            <div className="text-center text-sm text-gray-400 pt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/")}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Create Account
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-start text-xs text-gray-500">
              <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <div className="font-semibold text-gray-400 mb-1">Secure Login</div>
                <div>Your connection is encrypted and your data is protected with industry-standard security protocols</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}