import { isAuthenticated } from "../../middlewares/auth/isAuthenticated";
import { Request, Response, NextFunction } from "express";

describe("isAuthenticated middleware", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should call next() when session and userId exist", () => {
        req = {
            session: {
                userId: "12345",
            } as any, // 👈 bypass Session type enforcement
        };

        isAuthenticated(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 401 when session exists but no userId", () => {
        req = {
            session: {} as any,
        };

        isAuthenticated(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when session is missing", () => {
        req = {}; // no session

        isAuthenticated(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });
});
