import rateLimit from 'express-rate-limit';

// General API rate limiter - 100 requests per minute per user
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each user to 100 requests per windowMs
  message: {
    error: 'Too many requests from this user, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Stricter limiter for file uploads - 10 uploads per hour per user
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each user to 10 uploads per windowMs
  message: {
    error: 'Upload limit exceeded. Please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.user && req.user.role === 'admin';
  }
});

// Download rate limiter - 50 downloads per minute per user
export const downloadRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each user to 50 downloads per windowMs
  message: {
    error: 'Download limit exceeded. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return req.user && req.user.role === 'admin';
  }
});

// Bandwidth monitoring middleware
export const bandwidthMonitor = (req, res, next) => {
  const originalSend = res.send;
  let responseSize = 0;

  // Override res.send to track response size
  res.send = function(data) {
    if (data && typeof data === 'string') {
      responseSize = Buffer.byteLength(data, 'utf8');
    } else if (Buffer.isBuffer(data)) {
      responseSize = data.length;
    }

    // Track bandwidth usage for authenticated users
    if (req.user && responseSize > 0) {
      // Update user's bandwidth usage (this would be done asynchronously)
      // For now, we'll just log it - in production, update the database
      console.log(`User ${req.user._id} used ${responseSize} bytes of bandwidth`);
    }

    originalSend.call(this, data);
  };

  next();
};
