import fs from "fs";
import path from "path";
import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Absolute path to the directory where log files will be stored.
 * If the directory does not exist, it will be created automatically.
 * Logs are stored in a `../logs` folder relative to this file.
 */
const logDir = path.join(__dirname, "../logs");

// Create the log directory if it doesn't exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/**
 * Write stream for logging HTTP requests.
 * Logs will be appended to the `access.log` file in the logging directory.
 * The stream ensures logs persist across server restarts and are not overwritten.
 */
const accessLogStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" } // Append mode
);

/**
 * List of sensitive keys to redact from logs.
 */
const sensitiveFields = ["password", "token", "secret"];

/**
 * Recursively redacts sensitive fields from an object.
 * 
 * @param obj - The object to sanitize for logging
 * @returns A shallow copy with sensitive fields masked
 */
export const redactSensitiveFields = (obj: unknown): unknown => {
  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveFields(item));
  }

  if (typeof obj === "object" && obj !== null) {
    const clone: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.includes(key.toLowerCase())) {
        clone[key] = "***REDACTED***";
      } else if (typeof value === "object" && value !== null) {
        clone[key] = redactSensitiveFields(value);
      } else {
        clone[key] = value;
      }
    }

    return clone;
  }

  return obj;
};

/**
 * Custom logging middleware for Express.js that logs HTTP request details.
 * 
 * Logs include:
 * - Timestamp
 * - HTTP method and URL
 * - Query parameters (with sensitive fields redacted)
 * - Request body (with sensitive fields redacted)
 * - URL parameters (with sensitive fields redacted)
 * 
 * All logs are written to the `logs/access.log` file and formatted with ISO timestamp.
 * 
 * @example
 * app.use(loggingMiddleware);
 */
export const loggingMiddleware: RequestHandler = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;

  const redactedQuery = redactSensitiveFields(req.query);
  const redactedBody = redactSensitiveFields(req.body);
  const redactedParams = redactSensitiveFields(req.params);

  const log = `
[${timestamp}] ${method} ${url}
Query: ${JSON.stringify(redactedQuery)}
Body: ${JSON.stringify(redactedBody)}
Params: ${JSON.stringify(redactedParams)}
`;

  accessLogStream.write(log);

  next();
};
