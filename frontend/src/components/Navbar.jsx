// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">CloudNest</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Features
            </a>
            <a href="/how-it-works" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              How It Works
            </a>
            <a href="/security" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Security
            </a>
            <a href="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Pricing
            </a>
            <a href="/blog" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Blog
            </a>
            <a href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Sign In
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;