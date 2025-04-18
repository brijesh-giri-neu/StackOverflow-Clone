import 'express-async-errors';
import cors from "cors";
import { Server } from "http"; // Import the Server type from Node.js
import express, { type Express } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import fs from "fs";
import { middleware } from "express-openapi-validator";
import path from "path";
import tagRouter from "./pages/tag";
import answerRouter from "./pages/answer";
import questionRouter from "./pages/question";
import userRouter from "./pages/user";
import userProfileRouter from "./pages/userProfile";
import voteRouter from "./pages/vote"
import commentRouter from "./pages/comment"
import DBConnection from "./utilities/DBConnection";
import session from "express-session";
import { errorHandler } from "./middlewares/errorHandler";
import { loggingMiddleware } from "./middlewares/logger";
import { inputSanitizer } from "./middlewares/inputSanitizer";

/**
 * Client URL for CORS configuration.
 * @constant {string}
 */
const CLIENT_URL : string = process.env.CLIENT_URL || "http://localhost:3000";

/**
 * Port on which the server listens.
 * @constant {number}
 */
const port = process.env.PORT || 8000;

// Initialize database connection
// DBConnection.getInstance();

/**
 * Express app instance.
 * @type {Express}
 */
const app: Express = express();

// Required for trusting proxy headers on Render
app.set("trust proxy", 1);

/**
 * Middleware for handling Cross-Origin Resource Sharing (CORS).
 * Allows requests from the client URL.
 */
app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

/**
 * Middleware for parsing incoming JSON requests.
 */
app.use(express.json());

/**
 * Middleware for sanitizing user inputs in the incoming request by cleaning the data in:
 * - `req.body`
 * - `req.query`
 * - `req.params`
 */
app.use(inputSanitizer);

/**
 * Configure logging middleware
 */
app.use(loggingMiddleware);

/**
 * Configure express-session to enable user sessions.
 */
app.use(
  session({
    secret: "your_very_secret_key", // use a strong secret in production!
    resave: false,                  // avoid resaving session if unmodified
    saveUninitialized: false,       // only save session if something is stored
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,       // session expiration: 24 hour (adjust as needed)
      secure: false,                // set true if serving over HTTPS
      // Feature: Securing Authentication Cookies
      httpOnly: true,     // Prevents client-side JavaScript from accessing the cookie (protects against XSS)
      sameSite: true,     // Ensures cookies are sent only with same-site requests (protects against CSRF)
    },
  })
);

/**
 * Path to the OpenAPI specification YAML file.
 * @constant {string}
 */
const openApiPath = path.join(__dirname, 'openapi.yaml');

/**
 * Parses the OpenAPI YAML file into a JavaScript object.
 * @type {object}
 */
const openApiDocument = yaml.parse(fs.readFileSync(openApiPath, 'utf8'));

/**
 * Configuration options for Swagger UI.
 * @constant {object}
 */
const swaggerOptions = {
  customSiteTitle: "Fake Stack Overflow API Documentation",
  customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { margin: 20px 0 } .swagger-ui .scheme-container { display: none }',
  swaggerOptions: {
    displayRequestDuration: true,
    docExpansion: 'none',
    showCommonExtensions: true
  }
};

/**
 * Middleware to serve Swagger UI documentation for the OpenAPI spec.
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument, swaggerOptions));

/**
 * Middleware to validate requests and responses according to the OpenAPI specification.
 */
app.use(
  middleware({
    apiSpec: openApiPath,
    validateRequests: true,
    validateResponses: true,
    formats: {
      'mongodb-id': /^[0-9a-fA-F]{24}$/ // Custom format for validating MongoDB ObjectIds
    }
  })
);

/**
 * Routes for handling API requests related to tags, questions, and answers.
 */
app.use('/tag', tagRouter);
app.use('/question', questionRouter);
app.use('/answer', answerRouter);
app.use('/user', userRouter);
app.use('/userProfile', userProfileRouter);
app.use('/vote', voteRouter);
app.use('/comment', commentRouter);

/**
 * Register error handler middleware after every other middleware, right after routers for async error handler to work.
 */
app.use(errorHandler);

/**
 * Starts the Express server and listens for incoming requests.
 * Logs the server URL on startup.
 * @type {Server}
 */
let server: Server;
// Only run server + connect DB if not in test
if (process.env.NODE_ENV !== "test") {
  DBConnection.getInstance();

  server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
  });

  /**
 * Gracefully shuts down the server and disconnects from the MongoDB database on SIGINT (Ctrl+C).
 * Logs server and database disconnection statuses.
 */
  process.on("SIGINT", async () => {
    server.close(() => {
      console.log("Server closed.");
    });

    try {
      await DBConnection.getInstance().disconnect();
      process.exit(0);
    } catch (err) {
      console.error("Error during disconnection:", err);
      process.exit(1);
    }
  });
  module.exports = server; // Only export if defined
} else {
  module.exports = app; // During tests, export app
}

