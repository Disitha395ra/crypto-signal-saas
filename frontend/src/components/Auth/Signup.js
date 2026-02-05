import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../services/firebase";

const COUNTRIES = [
  "Sri Lanka",
  "India",
  "Pakistan",
  "Bangladesh",
  "Nepal",
  "Maldives",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "New Zealand",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "UAE",
];

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlan) {
      alert("No subscription plan selected");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      // 1️⃣ Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;
      // 2️⃣ Send verification email
      await sendEmailVerification(user);
      // 3️⃣ Store user profile in Firestore (no payment info here)
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        country: formData.country,
        plan: selectedPlan.name,
        billingCycle: selectedPlan.billing || "monthly",
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1-week free trial
        isActive: false,
        createdAt: serverTimestamp(),
      });
      alert("Verification email sent. Please verify before login.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-0 border border-gray-800">
        {/* Left Side - Plan Details */}
        <div className="bg-gradient-to-br from-gray-900 to-black p-12 border-r border-gray-800 hidden md:flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Create Your Account</h2>
            <p className="text-gray-400 mb-8">
              Join thousands of traders making data-driven decisions
            </p>

            {selectedPlan && (
              <div className="mb-8">
                <div className="border border-blue-500 bg-blue-950/20 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm uppercase tracking-wider text-blue-400">Selected Plan</span>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 font-semibold">
                      {selectedPlan.trial}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{selectedPlan.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-white">${selectedPlan.price}</span>
                    <span className="text-gray-400 ml-2">
                      /{selectedPlan.id === 1 ? 'month' : selectedPlan.id === 6 ? '6 months' : 'year'}
                    </span>
                  </div>
                  
                  {selectedPlan.features && (
                    <div className="space-y-2 mt-4 pt-4 border-t border-gray-800">
                      {selectedPlan.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start text-sm">
                          <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 text-sm">
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2"></div>
                <div>
                  <div className="font-semibold text-white mb-1">Instant Access</div>
                  <div className="text-gray-400">Start receiving signals immediately after verification</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2"></div>
                <div>
                  <div className="font-semibold text-white mb-1">Cancel Anytime</div>
                  <div className="text-gray-400">No long-term commitments. Full control over your subscription</div>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 mt-2"></div>
                <div>
                  <div className="font-semibold text-white mb-1">Secure & Private</div>
                  <div className="text-gray-400">Your data is encrypted and never shared with third parties</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 pt-8 border-t border-gray-800">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-black p-8 md:p-12">
          <div className="mb-8 md:hidden">
            <h2 className="text-2xl font-bold mb-2">Create Account</h2>
            {selectedPlan && (
              <div className="border border-gray-800 p-4 bg-gray-900 mb-4">
                <p className="font-semibold text-sm mb-1">{selectedPlan.name}</p>
                <p className="text-xs text-gray-400">{selectedPlan.trial}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  First Name
                </label>
                <input
                  name="firstName"
                  placeholder="John"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Last Name
                </label>
                <input
                  name="lastName"
                  placeholder="Doe"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="john.doe@example.com"
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-2">We'll send a verification link to this email</p>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                Country
              </label>
              <select
                name="country"
                onChange={handleChange}
                required
                className="w-full bg-gray-900 border border-gray-800 text-white p-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-black py-3 font-semibold hover:bg-gray-200 transition-colors duration-200 mt-6"
            >
              Create Account
            </button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-400 pt-4">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}