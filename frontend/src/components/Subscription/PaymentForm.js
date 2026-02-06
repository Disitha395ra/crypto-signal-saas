import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PaymentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processing, setProcessing] = useState(false);

  const plan = location.state?.plan;

  if (!plan) {
    navigate("/subscription");
    return null;
  }

  const handlePayNow = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      // 🔒 Later: Stripe logic
      // ✅ Now: fake successful payment
      navigate("/SignalsPage", {
        state: {
          subscription: plan.name
        }
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="grid md:grid-cols-2 gap-0 border border-gray-800">
          {/* Left Side - Order Summary */}
          <div className="bg-gradient-to-br from-gray-900 to-black p-8 md:p-12 border-r border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>

            {/* Plan Details */}
            <div className="border border-gray-800 bg-black p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Selected Plan</p>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{plan.trial}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-500">${plan.price}</p>
                  <p className="text-xs text-gray-500">/{plan.billing || 'period'}</p>
                </div>
              </div>

              {plan.features && plan.features.length > 0 && (
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start text-sm">
                      <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                  {plan.features.length > 5 && (
                    <p className="text-xs text-gray-500 pl-6">+ {plan.features.length - 5} more features</p>
                  )}
                </div>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">${plan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Free Trial Credit</span>
                <span className="text-green-500">-$0</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between">
                <span className="font-bold text-white">Total Due Today</span>
                <span className="font-bold text-2xl text-white">${plan.price}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="border-t border-gray-800 pt-6 space-y-3">
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Secure 256-bit SSL encryption</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Cancel anytime, no questions asked</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="bg-black p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-2 text-white">Payment Details</h2>
            <p className="text-sm text-gray-400 mb-8">Complete your purchase securely</p>

            {/* Fake Payment Form */}
            <form onSubmit={(e) => { e.preventDefault(); handlePayNow(); }} className="space-y-5">
              {/* Card Number */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    disabled
                    className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 pr-12 focus:outline-none"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-1">
                    <div className="w-8 h-5 bg-blue-600 rounded-sm"></div>
                    <div className="w-8 h-5 bg-red-600 rounded-sm"></div>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    disabled
                    className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    disabled
                    className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  disabled
                  className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none"
                />
              </div>

              {/* Billing Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">
                  Billing Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  disabled
                  className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none mb-3"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    disabled
                    className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    disabled
                    className="w-full bg-gray-900 border border-gray-800 text-gray-500 p-3 focus:outline-none"
                  />
                </div>
              </div>

              {/* Demo Notice */}
              <div className="border border-yellow-900 bg-yellow-950/20 p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-yellow-500 mb-1">Demo Payment Mode</p>
                    <p className="text-xs text-gray-400">This is a demonstration. No real charges will be made. Click "Pay Now" to simulate a successful payment.</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-3 font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Pay Now - ${plan.price}</span>
                  </>
                )}
              </button>

              {/* Back Link */}
              <button
                type="button"
                onClick={() => navigate("/subscription")}
                className="w-full text-gray-400 hover:text-white transition-colors text-sm py-2"
              >
                ← Back to Plans
              </button>
            </form>

            {/* Security Info */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-start text-xs text-gray-500">
                <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-400 mb-1">Your payment is secure</p>
                  <p>We use industry-standard encryption to protect your payment information. Your data is never stored on our servers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}