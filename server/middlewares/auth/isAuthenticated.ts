import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if a user is authenticated.
 * Allows the request to proceed if a valid session with userId exists.
 * Otherwise, responds with a 401 Unauthorized status.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next middleware function
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
