// src/components/HowItWorks.jsx
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Upload Your File",
      description: "Drag and drop or click to upload any file type. Our system automatically encrypts it during upload.",
      icon: "📤"
    },
    {
      step: "02",
      title: "Set Password",
      description: "Assign a strong password to your file. This password is required for anyone to access the file.",
      icon: "🔐"
    },
    {
      step: "03",
      title: "Get Secure Link",
      description: "Receive a unique, shareable link. Share this link and the password separately for maximum security.",
      icon: "🔗"
    },
    {
      step: "04",
      title: "Share & Access",
      description: "Recipients enter the password to access the file. You can revoke access anytime.",
      icon: "👥"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-purple-50 to-purple-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How CloudNest Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, secure, and powerful file protection in four easy steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {/* Step Number */}
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 z-10 relative">
                {step.step}
              </div>
              
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-purple-200 -z-10"></div>
              )}
              
              {/* Content */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
