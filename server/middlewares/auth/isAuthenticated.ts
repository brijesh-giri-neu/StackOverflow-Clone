import { Request, Response, NextFunction } from "express";
import { verifyToken, extractToken } from "../../services/authService";

/**
 * Extends Express Request to include userId from JWT authentication.
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

/**
 * Middleware to check if a user is authenticated.
 * Supports JWT token authentication via Authorization header (Bearer token).
 * Tokens are encrypted (JWE) and sent as Bearer tokens.
 * 
 * Also supports session-based authentication for backward compatibility.
 * 
 * Priority:
 * 1. JWT token from Authorization header (Bearer token) - encrypted JWE token
 * 2. Session-based authentication (req.session.userId) - for backward compatibility
 * 
 * If authenticated, sets req.userId with the user's ID and allows the request to proceed.
 * Otherwise, responds with a 401 Unauthorized status.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    // Check for encrypted JWT token in Authorization header.
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    if (token) {
        const decoded = await verifyToken(token);
        if (decoded && decoded.userId) {
            // JWT token is valid, set userId on request object.
            req.userId = decoded.userId;
            // Also set session userId for backward compatibility.
            if (req.session) {
                req.session.userId = decoded.userId;
            }
            return next();
        }
    }

    // Fall back to session-based authentication.
    if (req.session && req.session.userId) {
        req.userId = req.session.userId as string;
        return next();
    }

    // No valid authentication found.
    res.status(401).json({ message: "Unauthorized" });
};
