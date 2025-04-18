import { isAuthorized } from "../../middlewares/auth/isAuthorized";
import { Request, Response, NextFunction } from "express";

describe("isAuthorized middleware", () => {
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

    it("should call next if no userId param is provided and session userId exists", () => {
        req = {
            session: { userId: "123" } as any,
            params: {},
        };

        isAuthorized(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it("should call next if param userId matches session userId", () => {
        req = {
            session: { userId: "123" } as any,
            params: { userId: "123" },
        };

        isAuthorized(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
    });

    it("should return 403 if session userId is missing", () => {
        req = {
            session: {} as any,
            params: { userId: "123" },
        };

        isAuthorized(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if param userId does not match session userId", () => {
        req = {
            session: { userId: "123" } as any,
            params: { userId: "456" },
        };

        isAuthorized(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Forbidden" });
        expect(next).not.toHaveBeenCalled();
    });
});
