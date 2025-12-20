import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

// Custom response for rate limit exceeded
const rateLimitExceeded = (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    message: "Too many requests, please try again later.",
    retryAfter: res.getHeader("Retry-After"),
  });
};

// General API rate limiter (100 requests per 15 minutes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: rateLimitExceeded,
});

// Strict limiter for authentication routes (5 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register attempts per windowMs
  message:
    "Too many authentication attempts, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count successful requests
  handler: rateLimitExceeded,
});

// Stricter limiter for password operations (3 requests per hour)
export const passwordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password change attempts per hour
  message: "Too many password change attempts, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});

// File upload limiter (20 requests per hour)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: "Too many file uploads, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});

// Moderate limiter for case creation (30 requests per hour)
export const createCaseLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 case creations per hour
  message: "Too many case creation requests, please try again after an hour.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});

// Lenient limiter for read operations (200 requests per 15 minutes)
export const readLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 read requests per windowMs
  message: "Too many requests, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});

// Search limiter (50 requests per 15 minutes)
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 search requests per windowMs
  message: "Too many search requests, please try again after 15 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});

// View tracking limiter (100 requests per 15 minutes)
export const viewTrackingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many view tracking requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitExceeded,
});
