// src/components/PricingPage.jsx
import React, { useState, useEffect } from 'react';

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and personal projects",
      monthlyPrice: "0",
      annualPrice: "0",
      features: [
        "5GB secure storage",
        "Individual file password protection",
        "Basic file sharing",
        "AES-128 encryption",
        "30-day file retention",
        "Email support",
        "Up to 100MB file size"
      ],
      limitations: [
        "No advanced security",
        "Basic sharing controls",
        "Standard encryption only"
      ],
      popular: false,
      cta: "Get Started Free",
      color: "from-gray-500 to-gray-600",
      badge: "Free Forever"
    },
    {
      name: "Professional",
      description: "Ideal for professionals and growing teams",
      monthlyPrice: "12",
      annualPrice: "9", // $9/month equivalent - 25% savings
      features: [
        "250GB secure storage",
        "Advanced password protection",
        "Custom expiration dates",
        "AES-256 encryption",
        "Unlimited file retention",
        "Download limits & tracking",
        "Priority email & chat support",
        "Advanced analytics dashboard",
        "Up to 5GB file size",
        "Basic team management (3 users)"
      ],
      limitations: [
        "No SSO integration",
        "Limited custom branding"
      ],
      popular: true,
      cta: "Start Professional Trial",
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular"
    },
    {
      name: "Enterprise",
      description: "For organizations with advanced security needs",
      monthlyPrice: "39",
      annualPrice: "29", // $29/month equivalent - 25% savings
      features: [
        "2TB secure storage",
        "All Professional features",
        "Advanced team management",
        "SAML/SSO integration",
        "Custom branding",
        "Advanced security policies",
        "API access",
        "99.9% SLA guarantee",
        "Custom retention policies",
        "Dedicated account manager",
        "Phone support",
        "Unlimited file size",
        "Advanced compliance reporting"
      ],
      limitations: [
        "No limitations"
      ],
      popular: false,
      cta: "Contact Sales",
      color: "from-purple-500 to-indigo-600",
      badge: "Advanced"
    }
  ];

  const features = [
    {
      category: "Security & Compliance",
      items: [
        "End-to-end encryption",
        "Zero-knowledge architecture",
        "SOC 2 Type II compliant",
        "GDPR & CCPA ready",
        "Advanced threat protection"
      ]
    },
    {
      category: "Sharing & Collaboration",
      items: [
        "Password-protected sharing",
        "Custom expiration dates",
        "Download limits",
        "Access tracking & analytics",
        "Team management"
      ]
    },
    {
      category: "Storage & Performance",
      items: [
        "Global CDN",
        "Auto-scaling storage",
        "High-speed transfers",
        "99.9% uptime SLA",
        "Real-time backups"
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans include a 14-day free trial. No credit card required for the Starter plan."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for non-profit organizations and educational institutions."
    }
  ];

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
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-2xl p-2 shadow-lg border border-gray-200 mb-12">
              <span className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isAnnual ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md' : 'text-gray-600'
              }`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="mx-4 relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-300 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                role="switch"
                aria-checked={isAnnual}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isAnnual ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center">
                <span className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isAnnual ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' : 'text-gray-600'
                }`}>
                  Annual
                </span>
                {isAnnual && (
                  <span className="ml-3 bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full border border-green-200">
                    Save 25%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
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
                      
                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-5xl font-bold text-gray-900">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        {plan.monthlyPrice !== "0" && (
                          <span className="text-gray-600 ml-2 text-lg">
                            /{isAnnual ? 'year' : 'month'}
                          </span>
                        )}
                      </div>

                      {isAnnual && plan.monthlyPrice !== "0" && (
                        <p className="text-green-600 font-semibold text-sm">
                          ${(parseInt(plan.annualPrice) / 12).toFixed(2)}/month equivalent
                        </p>
                      )}
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

                      {/* Limitations */}
                      {plan.limitations.length > 0 && plan.limitations[0] !== "No limitations" && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-sm font-semibold text-gray-500 mb-3">LIMITATIONS</h4>
                          <ul className="space-y-2">
                            {plan.limitations.map((limitation, limitationIndex) => (
                              <li key={limitationIndex} className="flex items-start text-gray-500 text-sm">
                                <svg className="h-4 w-4 text-gray-400 flex-shrink-0 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>{limitation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white hover:shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105'
                          : plan.monthlyPrice === "0"
                          ? 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-2xl'
                          : 'bg-white text-gray-900 border-2 border-gray-300 hover:border-blue-500 hover:shadow-2xl'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Compare Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every plan includes core security features with advanced capabilities as you scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((category, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  {category.category}
                </h3>
                <ul className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Files?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust CloudNest with their sensitive data. 
            Start with our free plan and upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              Schedule Demo
            </button>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            No credit card required • 14-day free trial on paid plans • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;