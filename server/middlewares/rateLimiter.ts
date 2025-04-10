import rateLimit from "express-rate-limit";

/**
 * Rate limiting middleware for Express applications.
 *
 * Helps mitigate Denial of Service (DoS) attacks and brute-force attempts
 * by limiting the number of requests a single IP address can make within
 * a defined time window.
 *
 * Configuration:
 * - `windowMs`: 15 minutes (time window for rate limiting)
 * - `max`: 50 requests allowed per IP during the window
 * - `message`: Custom error message returned when the limit is exceeded
 *
 * This middleware is especially useful for public-facing endpoints like login,
 * registration, or any rate-sensitive API routes.
 */
export const appRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
