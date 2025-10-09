// src/pages/Blog.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles' },
    { id: 'security', name: 'Security' },
    { id: 'product', name: 'Product Updates' },
    { id: 'tutorials', name: 'Tutorials' },
    { id: 'company', name: 'Company News' }
  ];

  const blogPosts = [
    {
      id: 1,
      title: "Enhancing File Security with Advanced Password Protection",
      excerpt: "Learn how CloudNest's individual file password protection adds an extra layer of security to your sensitive documents.",
      category: 'security',
      author: {
        name: "Sarah Chen",
        role: "Security Lead",
        avatar: "SC"
      },
      date: "2024-01-15",
      readTime: "5 min read",
      image: "🔒",
      featured: true
    },
    {
      id: 2,
      title: "New Feature: Custom Expiration Dates for Shared Files",
      excerpt: "We've introduced custom expiration dates for shared files, giving you more control over your content's accessibility.",
      category: 'product',
      author: {
        name: "Mike Rodriguez",
        role: "Product Manager",
        avatar: "MR"
      },
      date: "2024-01-12",
      readTime: "3 min read",
      image: "📅",
      featured: true
    },
    {
      id: 3,
      title: "How to Securely Share Large Video Files with Clients",
      excerpt: "A step-by-step guide on using CloudNest to share large video files while maintaining security and control.",
      category: 'tutorials',
      author: {
        name: "Emily Watson",
        role: "Customer Success",
        avatar: "EW"
      },
      date: "2024-01-10",
      readTime: "7 min read",
      image: "🎥",
      featured: false
    },
    {
      id: 4,
      title: "CloudNest Achieves SOC 2 Type II Compliance",
      excerpt: "We're proud to announce that CloudNest has successfully completed SOC 2 Type II compliance certification.",
      category: 'company',
      author: {
        name: "David Kim",
        role: "Compliance Officer",
        avatar: "DK"
      },
      date: "2024-01-08",
      readTime: "4 min read",
      image: "🏆",
      featured: false
    },
    {
      id: 5,
      title: "Understanding End-to-End Encryption in Cloud Storage",
      excerpt: "Deep dive into how end-to-end encryption works and why it's crucial for protecting your files in the cloud.",
      category: 'security',
      author: {
        name: "Sarah Chen",
        role: "Security Lead",
        avatar: "SC"
      },
      date: "2024-01-05",
      readTime: "6 min read",
      image: "🔐",
      featured: false
    },
    {
      id: 6,
      title: "Best Practices for Managing Team File Access",
      excerpt: "Learn how to effectively manage team permissions and maintain security while collaborating on CloudNest.",
      category: 'tutorials',
      author: {
        name: "James Wilson",
        role: "Solutions Architect",
        avatar: "JW"
      },
      date: "2024-01-03",
      readTime: "8 min read",
      image: "👥",
      featured: false
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">CloudNest</span>
            </Link>
            <nav className="flex space-x-8">
              <Link to="/" className="text-purple-600 hover:text-purple-600 font-medium transition-colors">
                Home
              </Link>
              <Link to="/blog" className="text-purple-600 font-medium">
                Blog
              </Link>
              <Link to="/contact" className="text-purple-600 hover:text-purple-600 font-medium transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-violet-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">CloudNest Blog</h1>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Insights, updates, and best practices for secure file storage and sharing
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <input
              type="text"
              placeholder="Search articles..."
              className="px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 w-full max-w-md"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {activeCategory === 'all' && (
        <section className="py-16 bg-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-purple-50 rounded-2xl p-6 hover:shadow-lg transition-shadow border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  <div className="text-4xl mb-4">{post.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                        {post.author.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                        <p className="text-sm text-gray-500">{post.author.role}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-purple-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                    {categories.find(cat => cat.id === post.category)?.name}
                  </span>
                  <span className="text-gray-500 text-sm">{post.readTime}</span>
                </div>
                <div className="text-3xl mb-4">{post.image}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-sm font-semibold">
                      {post.author.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-white border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-lg font-semibold hover:border-purple-400 hover:text-purple-600 transition-colors">
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-purple-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Get the latest articles, product updates, and security tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
            />
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Blog;