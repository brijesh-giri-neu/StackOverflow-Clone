import { Request, Response, NextFunction } from "express";

/**
 * Middleware to check if the user is authorized to access a resource.
 *
 * - If a session exists and no `userId` param is provided, the request is allowed.
 * - If a `userId` param is present, it must match the user ID from the session.
 * - Otherwise, the request is denied with a 403 Forbidden response.
 *
 * @param {Request} req - The Express request object, which may contain session and route parameters.
 * @param {Response} res - The Express response object, used to return a 403 error if unauthorized.
 * @param {NextFunction} next - The next middleware function to call if authorization passes.
 */
export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    const sessionUserId = req.session?.userId;
    const paramUserId = req.params?.userId;

    if (!sessionUserId || (paramUserId && paramUserId !== sessionUserId)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};