// src/components/Hero.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const openDemoModal = () => {
    setIsDemoModalOpen(true);
  };

  const closeDemoModal = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <section className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Organize your files and keep them safe,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600 block">
                everywhere!
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
              We offer secure storage, ensuring all your data is protected from unauthorized access.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/dashboard" 
                className="bg-gradient-to-r from-purple-600 to-violet-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
              >
                Get Started
              </Link>
              <button
                onClick={openDemoModal}
                className="border-2 border-purple-200 text-purple-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-purple-400 hover:bg-purple-50 transition-all duration-300 text-center"
              >
                Request a demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">10M+</div>
                <div className="text-gray-600 text-sm md:text-base">active users</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">256GB+</div>
                <div className="text-gray-600 text-sm md:text-base">files stored</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">6M+</div>
                <div className="text-gray-600 text-sm md:text-base">uploaded files</div>
              </div>
            </div>
          </div>

          {/* Right Content - Professional File Storage Illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white/20">
                <div className="space-y-8">
                  {/* Professional File Icons Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Document File */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-200">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-blue-600 font-medium text-center">document.pdf</div>
                    </div>

                    {/* Image File */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-200">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 font-medium text-center">photo.jpg</div>
                    </div>

                    {/* Video File */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 shadow-sm border border-red-200">
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-red-600 font-medium text-center">video.mp4</div>
                    </div>
                  </div>

                  {/* Storage Capacity Indicator */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Storage Used</span>
                      <span className="text-sm font-bold text-purple-600">156GB / 256GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-violet-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: '61%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-900">256-bit Encryption</div>
                      <div className="text-xs text-gray-600">Military grade security</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-semibold text-gray-900">CloudNest Demo</h3>
              <button
                onClick={closeDemoModal}
                className="text-gray-400 hover:text-gray-600 text-3xl font-light transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-2">
              <div className="aspect-video bg-gray-900">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="CloudNest Demo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-gray-600 text-center">
                See how CloudNest can transform your file storage and security
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;