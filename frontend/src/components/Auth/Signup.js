import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.plan;

   //seLocation() → Home page එකෙන් එවපු data bag එක ගන්නවා
   //location.state → Home page එකෙන් එවපු state object එක
   //?.plan → ඒක ඇතුළේ තියෙන plan එක catch කරනවා

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
    cardName: "",
    cardNumber: "",
    cvv: "",
    expiry: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!selectedPlan) {
      alert("No subscription plan selected");
      return;
    }

    // 🔒 Later: send this to backend / payment gateway
    console.log("Signup Data:", formData);
    console.log("Selected Plan:", selectedPlan);

    alert(
      "Signup successful! Verification email will be sent (mock step)."
    );

    // After email verification → dashboard
    navigate("/dashboard");
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

          <input
            name="country"
            placeholder="Country"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          {/* Payment Info */}
          <h3 className="font-semibold mt-4">Payment Details</h3>

          <input
            name="cardName"
            placeholder="Card Holder Name"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <input
            name="cardNumber"
            placeholder="Card Number"
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />

          <div className="grid grid-cols-2 gap-2">
            <input
              name="expiry"
              placeholder="MM/YY"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
            <input
              name="cvv"
              placeholder="CVV"
              onChange={handleChange}
              required
              className="border p-2 rounded"
            />
          </div>

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
