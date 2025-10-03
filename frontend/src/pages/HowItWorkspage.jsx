// src/components/HowItWorksPage.jsx
import React, { useState, useEffect } from 'react';

const HowItWorksPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const steps = [
    {
      step: "01",
      title: "Upload Your File",
      description: "Drag and drop or click to upload any file type. Our system automatically encrypts it during upload with military-grade AES-256 encryption.",
      icon: "📤",
      features: ["Any file type supported", "Automatic encryption", "Drag & drop interface", "Progress tracking"]
    },
    {
      step: "02",
      title: "Set Password & Permissions",
      description: "Assign a strong password and set access permissions. Configure expiration dates, download limits, and access controls.",
      icon: "🔐",
      features: ["Custom passwords", "Access expiration", "Download limits", "Permission settings"]
    },
    {
      step: "03",
      title: "Get Secure Shareable Link",
      description: "Receive a unique, encrypted link. Share this link and the password separately through different channels for maximum security.",
      icon: "🔗",
      features: ["Encrypted URLs", "One-time access links", "Password protection", "Share tracking"]
    },
    {
      step: "04",
      title: "Manage & Monitor Access",
      description: "Track who accesses your files and when. Revoke access instantly or modify permissions at any time.",
      icon: "👥",
      features: ["Real-time analytics", "Access logs", "Instant revocation", "Usage reports"]
    }
  ];

  const securityFeatures = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description: "All files are encrypted before leaving your device and remain encrypted until accessed by authorized users."
    },
    {
      icon: "🌐",
      title: "Global CDN",
      description: "Fast, reliable file delivery through our global content delivery network with 99.9% uptime."
    },
    {
      icon: "📊",
      title: "Advanced Analytics",
      description: "Comprehensive tracking and reporting on file access, downloads, and user engagement."
    },
    {
      icon: "⚡",
      title: "High Performance",
      description: "Lightning-fast upload and download speeds with optimized compression and delivery."
    }
  ];

  const stats = [
    { number: "256-bit", label: "Military Grade Encryption" },
    { number: "99.9%", label: "Uptime SLA" },
    { number: "150+", label: "Countries Served" },
    { number: "10M+", label: "Files Secured" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              How CloudNest Works
            </h1>
            <p className={`text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Enterprise-grade file security and sharing made simple. Protect your sensitive data with our four-step process.
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg">
                Start Free Trial
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center transition-all duration-500 delay-100 transform hover:scale-105"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple Four-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Secure your files in minutes with our intuitive, security-focused workflow
            </p>
          </div>

          {/* Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="relative group"
                >
                  {/* Step Number & Connector */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 z-10 relative shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      {step.step}
                    </div>
                    
                    {/* Content Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 group-hover:shadow-2xl group-hover:border-blue-200 transition-all duration-300 h-full">
                      <div className="text-4xl mb-6 text-center">{step.icon}</div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {step.description}
                      </p>
                      
                      {/* Features List */}
                      <ul className="space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with security and performance at the core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="text-4xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Files?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of enterprises that trust CloudNest for their secure file sharing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 shadow-lg transform hover:scale-105">
              Get Started Free
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-300">
              Contact Sales
            </button>
          </div>
          <p className="text-blue-200 mt-6">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;