// src/pages/Features.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const [activeCategory, setActiveCategory] = useState('security');

  const categories = [
    { id: 'security', name: 'Security', icon: '🛡️' },
    { id: 'storage', name: 'Storage', icon: '💾' },
    { id: 'sharing', name: 'Sharing', icon: '🔗' },
    { id: 'productivity', name: 'Productivity', icon: '⚡' },
    { id: 'management', name: 'Management', icon: '📊' }
  ];

  const features = {
    security: [
      {
        title: "Individual File Password Protection",
        description: "Each file gets its own unique password. Share links and passwords separately for maximum security.",
        icon: "🔐",
        details: [
          "Unique passwords for every file",
          "Separate sharing of links and passwords",
          "No master password vulnerability"
        ],
        image: "🛡️"
      },
      {
        title: "End-to-End Encryption",
        description: "Files are encrypted on your device before upload and remain encrypted until downloaded with the correct password.",
        icon: "🔒",
        details: [
          "AES-256 military-grade encryption",
          "Zero-knowledge architecture",
          "Encryption at rest and in transit"
        ],
        image: "📡"
      },
      {
        title: "Advanced Access Controls",
        description: "Granular control over who can access your files and what they can do with them.",
        icon: "👥",
        details: [
          "Custom expiration dates",
          "Download limits and restrictions",
          "IP-based access controls"
        ],
        image: "🌐"
      },
      {
        title: "Security Compliance",
        description: "Built to meet enterprise security standards and compliance requirements.",
        icon: "📋",
        details: [
          "SOC 2 Type II compliant",
          "GDPR and HIPAA ready",
          "Regular security audits"
        ],
        image: "🏢"
      }
    ],
    storage: [
      {
        title: "Unlimited File Types",
        description: "Store any file type - images, videos, audio, documents, and more without restrictions.",
        icon: "📁",
        details: [
          "All file formats supported",
          "No file type restrictions",
          "Automatic format detection"
        ],
        image: "🎯"
      },
      {
        title: "Scalable Cloud Storage",
        description: "Enterprise-grade infrastructure that scales with your needs, from personal use to large organizations.",
        icon: "☁️",
        details: [
          "Automatic scaling",
          "99.9% uptime SLA",
          "Global CDN distribution"
        ],
        image: "📈"
      },
      {
        title: "Smart File Organization",
        description: "Advanced tagging, search, and organization features to keep your files manageable.",
        icon: "📂",
        details: [
          "AI-powered tagging",
          "Advanced search filters",
          "Custom folder structures"
        ],
        image: "🔍"
      },
      {
        title: "Automatic Backups",
        description: "Your files are automatically backed up across multiple secure locations.",
        icon: "💾",
        details: [
          "Redundant storage",
          "Point-in-time recovery",
          "Disaster recovery protocols"
        ],
        image: "🔄"
      }
    ],
    sharing: [
      {
        title: "Secure Link Sharing",
        description: "Generate secure, expirable links that can be shared with specific individuals or groups.",
        icon: "🔗",
        details: [
          "Password-protected links",
          "Custom expiration dates",
          "Download count limits"
        ],
        image: "📤"
      },
      {
        title: "Team Collaboration",
        description: "Share files securely with team members while maintaining full control over access.",
        icon: "👨‍💼",
        details: [
          "Team member management",
          "Role-based permissions",
          "Collaboration analytics"
        ],
        image: "🤝"
      },
      {
        title: "Public Sharing Options",
        description: "Create public access links with customizable security settings for broader distribution.",
        icon: "🌍",
        details: [
          "Public link generation",
          "View-only access options",
          "Embed capabilities"
        ],
        image: "📢"
      },
      {
        title: "Advanced Sharing Analytics",
        description: "Track how your shared files are being accessed and used in real-time.",
        icon: "📊",
        details: [
          "Real-time access logs",
          "Download analytics",
          "Geographic insights"
        ],
        image: "📍"
      }
    ],
    productivity: [
      {
        title: "Bulk File Operations",
        description: "Upload, download, and manage multiple files simultaneously with ease.",
        icon: "📦",
        details: [
          "Drag-and-drop uploads",
          "Bulk password setting",
          "Batch sharing operations"
        ],
        image: "🚀"
      },
      {
        title: "File Previews",
        description: "Preview files directly in your browser without downloading them.",
        icon: "👁️",
        details: [
          "Image and video previews",
          "Document text extraction",
          "Audio file streaming"
        ],
        image: "📺"
      },
      {
        title: "Automated Workflows",
        description: "Create custom automation rules for file management and sharing.",
        icon: "⚙️",
        details: [
          "Custom automation rules",
          "API integrations",
          "Scheduled operations"
        ],
        image: "🔄"
      },
      {
        title: "Mobile Optimization",
        description: "Full-featured mobile experience with optimized performance on all devices.",
        icon: "📱",
        details: [
          "Progressive web app",
          "Mobile-optimized interface",
          "Offline capabilities"
        ],
        image: "🌐"
      }
    ],
    management: [
      {
        title: "Centralized Dashboard",
        description: "Comprehensive overview of all your files, shares, and security settings in one place.",
        icon: "📈",
        details: [
          "Real-time activity feed",
          "Storage usage analytics",
          "Security status overview"
        ],
        image: "🎛️"
      },
      {
        title: "Advanced User Management",
        description: "Manage team members, permissions, and access levels with enterprise-grade controls.",
        icon: "👥",
        details: [
          "Role-based access control",
          "Team hierarchy management",
          "User activity monitoring"
        ],
        image: "🏢"
      },
      {
        title: "Comprehensive Analytics",
        description: "Detailed insights into file usage, storage trends, and security events.",
        icon: "📊",
        details: [
          "Usage analytics dashboard",
          "Security event logging",
          "Custom report generation"
        ],
        image: "🔍"
      },
      {
        title: "API & Integrations",
        description: "Powerful API and integration capabilities for custom workflows and third-party tools.",
        icon: "🔌",
        details: [
          "RESTful API access",
          "Webhook support",
          "Third-party integrations"
        ],
        image: "🛠️"
      }
    ]
  };

  const pricingPlans = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      features: [
        "5GB total storage",
        "Basic file password protection",
        "Standard encryption",
        "30-day file retention",
        "Community support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$9",
      period: "per month",
      features: [
        "100GB total storage",
        "Advanced password protection",
        "AES-256 encryption",
        "Unlimited file retention",
        "Custom expiration dates",
        "Priority support",
        "Basic analytics"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29",
      period: "per month",
      features: [
        "1TB total storage",
        "All Professional features",
        "Team management",
        "Advanced security policies",
        "SAML/SSO integration",
        "Custom branding",
        "Advanced analytics",
        "API access",
        "Dedicated support"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">CloudNest</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/features" className="text-blue-600 font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Pricing
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Powerful Features for Secure File Management
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Discover how CloudNest combines enterprise-grade security with intuitive file management 
            to protect your most important files.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features[activeCategory].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 mt-2">{feature.description}</p>
                    </div>
                  </div>
                  <div className="text-4xl opacity-20">
                    {feature.image}
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-3 text-gray-700">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-2">
                    <span>Learn more</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">10K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50M+</div>
              <div className="text-gray-300">Files Protected</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-400 mb-2">256-bit</div>
              <div className="text-gray-300">Encryption</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Pricing Comparison */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              All plans include our core security features. Upgrade for advanced capabilities and more storage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-2 border-blue-500 shadow-2xl relative'
                    : 'border border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                  </div>
                  {plan.period === 'forever' && (
                    <span className="text-gray-600">Free forever</span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.name === 'Enterprise' ? '/contact' : '/signup'}
                  className={`w-full block text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Secure Your Files?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust CloudNest with their sensitive files. 
            Start with our free plan and upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-blue-200 mt-4 text-sm">
            No credit card required • 14-day free trial on paid plans
          </p>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                </div>
                <span className="text-2xl font-bold">CloudNest</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Enterprise-grade secure file storage with individual password protection for every file.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/security" className="text-gray-300 hover:text-white transition-colors">Security</Link></li>
                <li><Link to="/api" className="text-gray-300 hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CloudNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
};

export default Features;