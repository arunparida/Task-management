const rateLimit = require("express-rate-limit");

// Generic rate limiter for all roles
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests per window per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// Middleware to apply rate limiter based on role
const applyRateLimiter = (role) => {
    return (req, res, next) => {
      if (!role || !roleBasedRateLimiters[role]) {
        return rateLimiter(req, res, next); // Apply default limiter
      }
      return roleBasedRateLimiters[role](req, res, next); // Apply role-specific limiter
    };
  };
  
  module.exports = { rateLimiter, applyRateLimiter };