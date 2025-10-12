// src/components/Header.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchUrl, setSearchUrl] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Navbar user state changed:', user);
  }, [user]);

  const handleSearch = () => {
    const url = searchUrl.trim();
    if (!url) return;
    // Parse URL: look for /file/ followed by ID
    const match = url.match(/\/file\/([^/?]+)/);
    if (match) {
      const id = match[1];
      navigate('/file/' + id);
      setSearchUrl('');
      setError('');
    } else {
      setError('Invalid file URL. Please paste a valid file link.');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 bg-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-3 transition-all duration-300">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes draw {
                  to {
                    stroke-dashoffset: 0;
                  }
                }
                .logo-path {
                  stroke-dasharray: 100;
                  stroke-dashoffset: 100;
                  animation: draw 2s ease-in-out forwards;
                }
              `}} />
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path pathLength="100" className="logo-path" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-gray-900">CloudNest</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="/features" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              Features
            </a>
            <a href="/how-it-works" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              How It Works
            </a>
            <a href="/security" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              Security
            </a>
            <a href="/pricing" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              Pricing
            </a>
            <a href="/blog" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              Blog
            </a>
            <a href="/contact" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
              Contact
            </a>
          </nav>

          {/* Search Section */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Paste file URL here..."
                value={searchUrl}
                onChange={(e) => setSearchUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button onClick={handleSearch} className="absolute right-2 top-1 text-purple-600 hover:text-purple-800 font-medium">
                Search
              </button>
            </div>
            {error && <p className="text-red-500 text-sm absolute top-12">{error}</p>}
          </div>

          {/* Auth Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg hover:bg-purple-700 transition-colors"
              >
                {user.email.charAt(0).toUpperCase()}
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                      navigate("/");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
