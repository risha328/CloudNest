// src/pages/Features.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const [activeCategory, setActiveCategory] = useState('security');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: 'security', name: 'Security & Sharing', icon: '🛡️', description: 'Advanced protection and sharing features' },
    { id: 'storage', name: 'Storage', icon: '💾', description: 'Scalable cloud storage' },
    { id: 'productivity', name: 'Productivity', icon: '⚡', description: 'Efficiency tools' },
    { id: 'management', name: 'Management', icon: '📊', description: 'Admin controls' }
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
          "No master password vulnerability",
          "Custom password requirements"
        ],
        gradient: "from-blue-500 to-cyan-500"
      },
      {
        title: "End-to-End Encryption",
        description: "Files are encrypted on your device before upload and remain encrypted until downloaded with the correct password.",
        icon: "🔒",
        details: [
          "AES-256 military-grade encryption",
          "Zero-knowledge architecture",
          "Encryption at rest and in transit",
          "Perfect forward secrecy"
        ],
        gradient: "from-cyan-500 to-blue-500"
      },
      {
        title: "Advanced Access Controls",
        description: "Granular control over who can access your files and what they can do with them.",
        icon: "👥",
        details: [
          "Custom expiration dates",
          "Download limits and restrictions",
          "IP-based access controls",
          "Geographic restrictions"
        ],
        gradient: "from-blue-400 to-indigo-500"
      },
      {
        title: "Security Compliance",
        description: "Built to meet enterprise security standards and compliance requirements.",
        icon: "📋",
        details: [
          "SOC 2 Type II compliant",
          "GDPR and HIPAA ready",
          "Regular security audits",
          "Penetration testing"
        ],
        gradient: "from-indigo-500 to-blue-500"
      },
      {
        title: "Secure Link Sharing",
        description: "Generate secure, expirable links that can be shared with specific individuals or groups.",
        icon: "🔗",
        details: [
          "Password-protected links",
          "Custom expiration dates",
          "Download count limits",
          "Access notifications"
        ],
        gradient: "from-blue-500 to-cyan-500"
      },
      {
        title: "Team Collaboration",
        description: "Share files securely with team members while maintaining full control over access.",
        icon: "👨‍💼",
        details: [
          "Team member management",
          "Role-based permissions",
          "Collaboration analytics",
          "Activity tracking"
        ],
        gradient: "from-cyan-500 to-blue-500"
      },
      {
        title: "Public Sharing Options",
        description: "Create public access links with customizable security settings for broader distribution.",
        icon: "🌍",
        details: [
          "Public link generation",
          "View-only access options",
          "Embed capabilities",
          "Brand customization"
        ],
        gradient: "from-blue-400 to-indigo-500"
      },
      {
        title: "Advanced Sharing Analytics",
        description: "Track how your shared files are being accessed and used in real-time.",
        icon: "📊",
        details: [
          "Real-time access logs",
          "Download analytics",
          "Geographic insights",
          "Usage patterns"
        ],
        gradient: "from-indigo-500 to-blue-500"
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
          "Automatic format detection",
          "File type validation"
        ],
        gradient: "from-blue-500 to-cyan-500"
      },
      {
        title: "Scalable Cloud Storage",
        description: "Enterprise-grade infrastructure that scales with your needs, from personal use to large organizations.",
        icon: "☁️",
        details: [
          "Automatic scaling",
          "99.9% uptime SLA",
          "Global CDN distribution",
          "Multi-region replication"
        ],
        gradient: "from-cyan-500 to-blue-500"
      },
      {
        title: "Smart File Organization",
        description: "Advanced tagging, search, and organization features to keep your files manageable.",
        icon: "📂",
        details: [
          "AI-powered tagging",
          "Advanced search filters",
          "Custom folder structures",
          "Metadata extraction"
        ],
        gradient: "from-blue-400 to-indigo-500"
      },
      {
        title: "Automatic Backups",
        description: "Your files are automatically backed up across multiple secure locations.",
        icon: "💾",
        details: [
          "Redundant storage",
          "Point-in-time recovery",
          "Disaster recovery protocols",
          "Version history"
        ],
        gradient: "from-indigo-500 to-blue-500"
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
          "Batch sharing operations",
          "Progress tracking"
        ],
        gradient: "from-blue-500 to-cyan-500"
      },
      {
        title: "File Previews",
        description: "Preview files directly in your browser without downloading them.",
        icon: "👁️",
        details: [
          "Image and video previews",
          "Document text extraction",
          "Audio file streaming",
          "Multi-page document support"
        ],
        gradient: "from-cyan-500 to-blue-500"
      },
      {
        title: "Automated Workflows",
        description: "Create custom automation rules for file management and sharing.",
        icon: "⚙️",
        details: [
          "Custom automation rules",
          "API integrations",
          "Scheduled operations",
          "Conditional triggers"
        ],
        gradient: "from-blue-400 to-indigo-500"
      },
      {
        title: "Mobile Optimization",
        description: "Full-featured mobile experience with optimized performance on all devices.",
        icon: "📱",
        details: [
          "Progressive web app",
          "Mobile-optimized interface",
          "Offline capabilities",
          "Touch-friendly design"
        ],
        gradient: "from-indigo-500 to-blue-500"
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
          "Security status overview",
          "Performance metrics"
        ],
        gradient: "from-blue-500 to-cyan-500"
      },
      {
        title: "Advanced User Management",
        description: "Manage team members, permissions, and access levels with enterprise-grade controls.",
        icon: "👥",
        details: [
          "Role-based access control",
          "Team hierarchy management",
          "User activity monitoring",
          "Access reviews"
        ],
        gradient: "from-cyan-500 to-blue-500"
      },
      {
        title: "Comprehensive Analytics",
        description: "Detailed insights into file usage, storage trends, and security events.",
        icon: "📊",
        details: [
          "Usage analytics dashboard",
          "Security event logging",
          "Custom report generation",
          "Export capabilities"
        ],
        gradient: "from-blue-400 to-indigo-500"
      },
      {
        title: "API & Integrations",
        description: "Powerful API and integration capabilities for custom workflows and third-party tools.",
        icon: "🔌",
        details: [
          "RESTful API access",
          "Webhook support",
          "Third-party integrations",
          "Custom development"
        ],
        gradient: "from-indigo-500 to-blue-500"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Powerful Features for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                Secure File Management
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover how CloudNest combines enterprise-grade security with intuitive file management 
              to protect your most important files with individual password protection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-12 bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Our Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to secure, manage, and share your files with confidence
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex flex-col items-center p-6 rounded-2xl min-w-[140px] transition-all duration-300 border-2 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 border-transparent transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-blue-100 hover:border-blue-300'
                }`}
              >
                <span className="text-3xl mb-3">{category.icon}</span>
                <span className="font-semibold mb-1">{category.name}</span>
                <span className={`text-xs ${
                  activeCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {category.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {categories.find(cat => cat.id === activeCategory)?.name} Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {activeCategory === 'security' && 'Advanced security and sharing features to protect and distribute your sensitive files'}
              {activeCategory === 'storage' && 'Scalable and reliable storage solutions for all your needs'}
              {activeCategory === 'productivity' && 'Tools and features to enhance your workflow efficiency'}
              {activeCategory === 'management' && 'Comprehensive management and analytics for administrators'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features[activeCategory].map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 border-2 border-blue-100 hover:border-blue-300 transform hover:scale-105"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center text-2xl text-white shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {feature.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{detail}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8 pt-6 border-t border-blue-100">
                  <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-2 group">
                    <span>Learn more about this feature</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <section className="py-16 bg-white border-t border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-semibold">Uptime SLA</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">256-bit</div>
              <div className="text-gray-600 font-semibold">Encryption</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600 font-semibold">Countries Served</div>
            </div>
            <div className="p-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10M+</div>
              <div className="text-gray-600 font-semibold">Files Secured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience CloudNest?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of businesses and individuals who trust CloudNest with their sensitive files. 
            Get started with our free plan today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-blue-100 mt-6 text-sm">
            No credit card required • 14-day free trial on paid plans • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
};

export default Features;