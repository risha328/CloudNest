// src/components/SecurityPage.jsx
import React, { useState, useEffect } from 'react';

const SecurityPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const securityFeatures = [
    {
      icon: "🔒",
      title: "End-to-End Encryption",
      description: "Military-grade AES-256 encryption ensures your files are protected from upload to download.",
      details: [
        "Zero-knowledge architecture",
        "Client-side encryption",
        "Encryption at rest and in transit",
        "Perfect forward secrecy"
      ],
      color: "from-purple-400 to-violet-400"
    },
    {
      icon: "🛡️",
      title: "Advanced Threat Protection",
      description: "Multi-layered security with real-time threat detection and prevention.",
      details: [
        "AI-powered malware scanning",
        "Real-time threat intelligence",
        "Behavioral analysis",
        "Automated threat response"
      ],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "🌐",
      title: "Global Security Compliance",
      description: "Meet the highest industry standards with our comprehensive compliance framework.",
      details: [
        "SOC 2 Type II certified",
        "GDPR & CCPA compliant",
        "HIPAA ready",
        "ISO 27001 certified"
      ],
      color: "from-violet-400 to-purple-500"
    },
    {
      icon: "🔑",
      title: "Access Control & Authentication",
      description: "Granular access controls and multi-factor authentication for maximum security.",
      details: [
        "Multi-factor authentication",
        "Role-based access control",
        "Single sign-on (SSO)",
        "Biometric authentication"
      ],
      color: "from-purple-400 to-violet-400"
    }
  ];

  const securityStats = [
    { number: "99.99%", label: "Uptime SLA", icon: "⚡" },
    { number: "256-bit", label: "Encryption Standard", icon: "🔐" },
    { number: "0", label: "Security Breaches", icon: "🛡️" },
    { number: "150+", label: "Security Audits", icon: "📊" }
  ];

  const complianceLogos = [
    { name: "SOC 2", icon: "🏢" },
    { name: "GDPR", icon: "🇪🇺" },
    { name: "HIPAA", icon: "🏥" },
    { name: "ISO 27001", icon: "🌐" },
    { name: "CCPA", icon: "🔒" },
    { name: "PCI DSS", icon: "💳" }
  ];

  const securityPrinciples = [
    {
      title: "Zero Trust Architecture",
      description: "Never trust, always verify. Every access request is fully authenticated and authorized.",
      icon: "🎯"
    },
    {
      title: "Defense in Depth",
      description: "Multiple layers of security controls provide comprehensive protection across all attack vectors.",
      icon: "🛡️"
    },
    {
      title: "Privacy by Design",
      description: "Privacy and data protection are embedded throughout the entire system development lifecycle.",
      icon: "📱"
    },
    {
      title: "Continuous Monitoring",
      description: "24/7 security monitoring and real-time threat detection ensure immediate response to any incident.",
      icon: "👁️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-100">Security</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-50 max-w-4xl mx-auto mb-8 leading-relaxed">
              Military-grade protection for your most sensitive data. Built with zero-trust architecture and end-to-end encryption.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-2xl hover:shadow-white/25 transform hover:scale-105">
                Request Security Brief
              </button>
              <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                View Compliance Docs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Stats */}
      <section className="py-16 bg-white border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {securityStats.map((stat, index) => (
              <div 
                key={index}
                className="text-center group transition-all duration-500"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 text-purple-500">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-purple-600 font-medium text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Security Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Security Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive protection built on industry-leading security practices and cutting-edge technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Feature Navigation */}
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeFeature === index
                      ? 'bg-purple-50 border-purple-400 shadow-lg shadow-purple-200'
                      : 'bg-white border-purple-100 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Feature Details */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-100 shadow-lg">
              <div className={`text-6xl mb-6 text-center bg-gradient-to-r ${securityFeatures[activeFeature].color} bg-clip-text text-transparent`}>
                {securityFeatures[activeFeature].icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                {securityFeatures[activeFeature].title}
              </h3>
              <p className="text-gray-600 text-lg mb-8 text-center">
                {securityFeatures[activeFeature].description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {securityFeatures[activeFeature].details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-purple-100">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Principles */}
      <section className="py-20 bg-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Security Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on fundamental security principles that guide every aspect of our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityPrinciples.map((principle, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 group hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300 text-purple-500">
                  {principle.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {principle.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Industry Compliance & Certifications
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meeting the highest standards of security and compliance across industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
            {complianceLogos.map((logo, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center border-2 border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group shadow-lg hover:shadow-xl"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-purple-500">
                  {logo.icon}
                </div>
                <div className="text-gray-900 font-semibold text-sm">
                  {logo.name}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Download Compliance Report
            </button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-violet-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Secure Your Data?
          </h2>
          <p className="text-xl text-purple-50 mb-8 max-w-2xl mx-auto">
            Join thousands of security-conscious organizations that trust CloudNest with their most sensitive data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-300 shadow-2xl transform hover:scale-105">
              Start Secure Trial
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
              Contact Security Team
            </button>
          </div>
          <p className="text-purple-100 mt-6 text-sm">
            All plans include enterprise-grade security features • SOC 2 compliant • 24/7 security monitoring
          </p>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;