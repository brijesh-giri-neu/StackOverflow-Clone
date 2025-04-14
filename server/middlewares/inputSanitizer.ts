import mongoSanitize from "express-mongo-sanitize";
import xss from "xss";
import { RequestHandler } from "express";

/**
 * Recursively sanitizes strings within an object using the `xss` library.
 * Prevents Cross-Site Scripting (XSS) by escaping dangerous HTML/JS input.
 *
 * @param obj - The object to sanitize
 */
const sanitizeObject = (obj: any): void => {
  if (typeof obj !== "object" || obj === null) return;

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      obj[key] = xss(obj[key]);
    } else if (typeof obj[key] === "object") {
      sanitizeObject(obj[key]); // recursive
    }
  }
};

/**
 * Middleware to sanitize incoming request data using `xss`.
 * Applies to req.body, req.query, and req.params.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express Next function
 */
const xssSanitizer: RequestHandler = (req, _, next) => {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

/**
 * Combined input sanitizer middleware array:
 * 1. Prevents NoSQL injection using express-mongo-sanitize
 * 2. Prevents XSS using recursive `xss` filter
 *
 * @example
 * app.use(inputSanitizer); // Place before routes
 */
export const inputSanitizer: RequestHandler[] = [
  mongoSanitize(),
  xssSanitizer,
];
