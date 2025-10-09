// src/components/PricingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const PricingPage = () => {
  const { user, updatePlan } = useContext(AuthContext);
  const [isAnnual, setIsAnnual] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activePlan, setActivePlan] = useState(user?.plan || 'free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      name: "Free",
      description: "Perfect for individuals and personal projects",
      features: [
        "5 GB Storage",
        "Individual file password protection",
        "Basic file sharing",
        "30 days file retention",
        "Email support",
        "100 MB file size limit"
      ],
      popular: false,
      cta: "Current Plan",
      color: "from-gray-500 to-gray-600",
      badge: "Free Forever"
    },
    {
      name: "Pro",
      description: "Ideal for professionals and growing teams",
      features: [
        "250 GB Storage",
        "Advanced file password protection (e.g., 2FA, stronger encryption)",
        "Advanced file sharing (custom expiration, download limits)",
        "Unlimited file retention",
        "Priority email + chat support",
        "5 GB file size limit",
        "Advanced analytics dashboard",
        "Team management (up to 3 users)"
      ],
      popular: true,
      cta: activePlan === 'pro' ? "Pro Active" : "Activate Pro",
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular"
    }
  ];

  const handleActivatePro = async () => {
    if (activePlan === 'pro') return; // Already active
    setLoading(true);
    setError(null);
    try {
      // Call backend API to update subscription
      const response = await API.put('/users/subscription', { plan: 'pro' });
      if (response.data.plan === 'pro') {
        setActivePlan('pro');
        updatePlan('pro');
        // Force refresh user data from backend to ensure consistency
        const userResponse = await API.get('/auth/me');
        if (userResponse.data) {
          updatePlan(userResponse.data.plan);
        }
      }
    } catch (err) {
      setError('Failed to activate Pro plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Transparent</span> Pricing
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Start free, scale as you grow. Enterprise-grade security at every plan.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative group transition-all duration-500 transform hover:scale-105 ${
                  plan.popular ? 'lg:-translate-y-4' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl shadow-blue-500/25">
                      ⭐ {plan.badge}
                    </span>
                  </div>
                )}

                {/* Plan Card */}
                <div className={`relative h-full rounded-3xl border-2 ${
                  plan.popular 
                    ? 'border-blue-500/50 shadow-2xl' 
                    : 'border-gray-200/50 shadow-xl'
                } bg-white/80 backdrop-blur-sm overflow-hidden`}>
                  
                  {/* Gradient Top */}
                  <div className={`bg-gradient-to-r ${plan.color} h-2 w-full`}></div>
                  
                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      {!plan.popular && plan.badge && (
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                      <p className="text-gray-600 mb-6">{plan.description}</p>
                    </div>

                    {/* Features */}
                    <div className="flex-1 mb-8">
                      <ul className="space-y-4">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                              <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <button
                      disabled={loading || activePlan === plan.name.toLowerCase()}
                      onClick={plan.name === 'Pro' ? handleActivatePro : undefined}
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105'
                          : 'bg-gray-900 text-white'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading && plan.name === 'Pro' ? 'Activating...' : plan.cta}
                    </button>
                    {error && plan.name === 'Pro' && (
                      <p className="text-red-600 mt-2 text-center">{error}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
