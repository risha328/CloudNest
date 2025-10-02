// src/components/Security.jsx
import React from 'react';

const Security = () => {
  const securityFeatures = [
    {
      title: "Zero-Knowledge Architecture",
      description: "We never have access to your passwords or unencrypted files. Only you and those you share with can access your content.",
      icon: "🔒"
    },
    {
      title: "End-to-End Encryption",
      description: "Files are encrypted on your device before upload and remain encrypted until downloaded with the correct password.",
      icon: "🛡️"
    },
    {
      title: "GDPR & HIPAA Compliant",
      description: "Built with privacy regulations in mind. Suitable for sensitive personal and business data.",
      icon: "📋"
    },
    {
      title: "Regular Security Audits",
      description: "Third-party security experts regularly audit our infrastructure and codebase.",
      icon: "🔍"
    }
  ];

  return (
    <section id="security" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Military-Grade Security
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Your privacy is our top priority. CloudNest is built with security-first architecture 
              that ensures your files remain protected at all times.
            </p>
            
            <div className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Security Visual */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Security First</h3>
              <p className="text-blue-100 mb-6 leading-relaxed">
                Every file is individually encrypted with AES-256 encryption. 
                Passwords are hashed using bcrypt and never stored in plain text.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">AES-256</div>
                  <div className="text-blue-200 text-sm">Encryption</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">TLS 1.3</div>
                  <div className="text-blue-200 text-sm">In Transit</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
