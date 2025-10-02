// src/components/Pricing.jsx
import React, { useState } from 'react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small projects",
      monthlyPrice: "0",
      annualPrice: "0",
      features: [
        "5GB total storage",
        "Individual file password protection",
        "Basic file sharing",
        "Standard encryption",
        "30-day file retention",
        "Community support"
      ],
      limitations: [
        "Max file size: 100MB",
        "No advanced security features",
        "Basic analytics"
      ],
      popular: false,
      cta: "Get Started Free",
      color: "gray"
    },
    {
      name: "Professional",
      description: "Ideal for professionals and growing teams",
      monthlyPrice: "9",
      annualPrice: "90", // $7.5/month equivalent
      features: [
        "100GB total storage",
        "Individual file password protection",
        "Advanced sharing controls",
        "AES-256 encryption",
        "Unlimited file retention",
        "Custom expiration dates",
        "Download limits",
        "Priority support",
        "Basic analytics dashboard"
      ],
      limitations: [
        "Max file size: 2GB",
        "No team management"
      ],
      popular: true,
      cta: "Start Professional",
      color: "blue"
    },
    {
      name: "Enterprise",
      description: "For organizations with advanced security needs",
      monthlyPrice: "29",
      annualPrice: "290", // $24.17/month equivalent
      features: [
        "1TB total storage",
        "All Professional features",
        "Team management",
        "Advanced security policies",
        "SAML/SSO integration",
        "Custom branding",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "99.9% SLA guarantee",
        "Custom retention policies"
      ],
      limitations: [
        "No limitations"
      ],
      popular: false,
      cta: "Contact Sales",
      color: "purple"
    }
  ];

  const toggleBilling = () => {
    setIsAnnual(!isAnnual);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={toggleBilling}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
              </button>
              <span className={`text-lg font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                  Save 17%
                </span>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl border-2 ${
                  plan.popular
                    ? 'border-blue-500 shadow-2xl transform scale-105'
                    : 'border-gray-200 shadow-lg'
                } bg-white p-8 flex flex-col h-full`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    {plan.monthlyPrice !== "0" && (
                      <span className="text-gray-600 ml-2">
                        /{isAnnual ? 'year' : 'month'}
                      </span>
                    )}
                  </div>

                  {isAnnual && plan.monthlyPrice !== "0" && (
                    <p className="text-green-600 font-medium">
                      ${(parseInt(plan.annualPrice) / 12).toFixed(2)}/month equivalent
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg
                          className="h-6 w-6 text-green-500 flex-shrink-0 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, limitationIndex) => (
                          <li key={limitationIndex} className="flex items-start text-gray-500">
                            <svg
                              className="h-5 w-5 text-gray-400 flex-shrink-0 mr-2 mt-0.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            <span className="text-sm">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : plan.monthlyPrice === "0"
                      ? 'bg-gray-900 hover:bg-gray-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-2 border-gray-300'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Need Custom Solutions?</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Our enterprise plan offers custom storage limits, dedicated infrastructure, 
                and personalized support for large organizations with specific requirements.
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Our Sales Team
              </button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-8">Trusted by teams at</p>
            <div className="overflow-hidden">
              <div
                className="flex gap-8 opacity-60"
                style={{
                  animation: 'marquee 20s linear infinite',
                }}
              >
                {/* Example company logos - you can replace with actual logos */}
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">TechCorp</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">InnovateLabs</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">SecureSystems</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">DataFlow</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">CloudFirst</div>
                {/* Duplicate for seamless loop */}
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">TechCorp</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">InnovateLabs</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">SecureSystems</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">DataFlow</div>
                <div className="text-2xl font-bold text-blue-400 whitespace-nowrap">CloudFirst</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  export default Pricing;