import { Request, Response, NextFunction } from "express";

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
    // Optionally, if you want to check that the session userId matches the requested userId:
    // if (req.session && req.session.userId === req.params.userId) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden" });
    }
};