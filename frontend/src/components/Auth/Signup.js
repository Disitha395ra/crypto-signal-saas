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
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2">Create Account</h2>

        {selectedPlan && (
          <div className="mb-4 p-3 border rounded bg-gray-50">
            <p className="font-semibold">Selected Plan:</p>
            <p>{selectedPlan.name}</p>
            <p className="text-sm text-gray-600">{selectedPlan.trial}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* User Info */}
          <div className="grid grid-cols-2 gap-2">
            <input
              name="firstName"
              placeholder="First Name"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="lastName"
              placeholder="Last Name"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>

          {/* Country Dropdown */}
          <select
            name="country"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Select Country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
