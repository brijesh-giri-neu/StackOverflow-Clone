import "../setup/mocks";
import { mockVerifyToken, mockExtractToken } from "../setup/mocks";
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
        jest.clearAllMocks();
    });

    it("should call next() when JWT token is valid", async () => {
        req = {
            headers: {
                authorization: "Bearer valid.token.here",
            },
        };

        mockExtractToken.mockReturnValue("valid.token.here");
        mockVerifyToken.mockResolvedValue({
            userId: "12345",
            email: "test@example.com",
        });

        await isAuthenticated(req as Request, res as Response, next);
        expect(mockExtractToken).toHaveBeenCalledWith("Bearer valid.token.here");
        expect(mockVerifyToken).toHaveBeenCalledWith("valid.token.here");
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(req.userId).toBe("12345");
    });

    it("should call next() when session and userId exist", async () => {
        req = {
            session: {
                userId: "12345",
            } as any,
            headers: {},
        };

        mockExtractToken.mockReturnValue(null);
        mockVerifyToken.mockResolvedValue(null);

        await isAuthenticated(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(req.userId).toBe("12345");
    });

    it("should return 401 when session exists but no userId and no valid token", async () => {
        req = {
            session: {} as any,
            headers: {},
        };

        mockExtractToken.mockReturnValue(null);
        mockVerifyToken.mockResolvedValue(null);

        await isAuthenticated(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when session is missing and no valid token", async () => {
        req = {
            headers: {},
        };

        mockExtractToken.mockReturnValue(null);
        mockVerifyToken.mockResolvedValue(null);

        await isAuthenticated(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 when JWT token is invalid", async () => {
        req = {
            headers: {
                authorization: "Bearer invalid.token.here",
            },
        };

        mockExtractToken.mockReturnValue("invalid.token.here");
        mockVerifyToken.mockResolvedValue(null);

        await isAuthenticated(req as Request, res as Response, next);
        expect(mockExtractToken).toHaveBeenCalledWith("Bearer invalid.token.here");
        expect(mockVerifyToken).toHaveBeenCalledWith("invalid.token.here");
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
        expect(next).not.toHaveBeenCalled();
    });
});
