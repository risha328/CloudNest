// src/pages/Contact.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      company: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    });
  };

  const contactMethods = [
    {
      icon: "💬",
      title: "Chat Support",
      description: "Get instant help from our support team",
      details: "Available 24/7",
      action: "Start Chat",
      color: "blue"
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Speak directly with our experts",
      details: "+1 (555) 123-4567",
      action: "Call Now",
      color: "green"
    },
    {
      icon: "📧",
      title: "Email Us",
      description: "Send us an email anytime",
      details: "support@cloudnest.com",
      action: "Send Email",
      color: "purple"
    },
    {
      icon: "🕐",
      title: "Office Hours",
      description: "Visit us during business hours",
      details: "Mon-Fri, 9AM-6PM PST",
      action: "View Calendar",
      color: "orange"
    }
  ];

  const faqs = [
    {
      question: "How secure is CloudNest for sensitive files?",
      answer: "CloudNest uses military-grade AES-256 encryption and individual file password protection to ensure your sensitive files remain secure. We operate on a zero-knowledge architecture."
    },
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Absolutely! Our enterprise team can create custom solutions tailored to your organization's specific needs, including custom storage limits and dedicated infrastructure."
    },
    {
      question: "What file types are supported?",
      answer: "CloudNest supports all file types including images, videos, audio files, documents, and more. There are no restrictions on file types."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">CloudNest</span>
            </Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Blog
              </Link>
              <Link to="/contact" className="text-blue-600 font-medium">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            We're here to help you secure and manage your files. Reach out to our team for any questions.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 mb-3">{method.description}</p>
                <p className="text-gray-700 font-medium mb-4">{method.details}</p>
                <button className={`bg-${method.color}-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-${method.color}-700 transition-colors w-full`}>
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Your company"
                    />
                  </div>
                  <div>
                    <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type *
                    </label>
                    <select
                      id="inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="security">Security Question</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Brief subject line"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Office</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      📍
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Headquarters</h4>
                      <p className="text-gray-600">123 Security Drive<br />San Francisco, CA 94105<br />United States</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                      🌍
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Regional Offices</h4>
                      <p className="text-gray-600">London • Berlin • Singapore<br />Tokyo • Sydney • Toronto</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Answers</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  View All FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Global Presence</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            With data centers and offices around the world, we provide fast, secure file storage no matter where you are.
          </p>
          <div className="bg-gray-800 rounded-2xl p-8 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <p className="text-gray-300">Interactive map showing our global data centers and offices</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;