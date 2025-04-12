import fs from "fs";
import path from "path";
import morgan from "morgan";
import { RequestHandler } from "express";

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
 * Logging middleware for Express.js applications.
 * 
 * Uses `morgan` in "dev" format for concise colored output during development,
 * and writes logs to `logs/access.log` for persistent storage.
 * 
 * Each incoming HTTP request is logged with details including:
 * - Method (GET, POST, etc.)
 * - URL path
 * - Status code
 * - Response time
 * 
 * @type {RequestHandler}
 * 
 * @example
 * import { loggingMiddleware } from './middlewares/logger';
 * app.use(loggingMiddleware);
 */
export const loggingMiddleware: RequestHandler = morgan("dev", {
  stream: accessLogStream,
});
