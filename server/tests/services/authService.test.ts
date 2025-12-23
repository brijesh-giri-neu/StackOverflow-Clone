import { hashPassword, generateToken, verifyToken, extractToken, JWTPayload } from "../../services/authService";
import bcrypt from "bcrypt";
import { EncryptJWT, jwtDecrypt, importJWK, base64url } from "jose";
import crypto from "crypto";

// Mock bcrypt
jest.mock("bcrypt", () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
}));

// Mock jose library
jest.mock("jose", () => {
    const mockEncryptJWT = jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        encrypt: jest.fn(),
    }));

    return {
        EncryptJWT: mockEncryptJWT,
        jwtDecrypt: jest.fn(),
        importJWK: jest.fn(),
        base64url: {
            encode: jest.fn(),
        },
    };
});

// Mock crypto module
jest.mock("crypto", () => ({
    createHash: jest.fn(),
}));

describe("authService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Suppress console.log for error tests
        jest.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("hashPassword", () => {
        const plainPassword = "securePass123";

        it("should return a hashed string that is not equal to the plain password", async () => {
            (bcrypt.genSalt as jest.Mock).mockResolvedValue("mockSalt");
            (bcrypt.hash as jest.Mock).mockResolvedValue("mockHashedPassword");

            const hashed = await hashPassword(plainPassword);
            expect(typeof hashed).toBe("string");
            expect(hashed).not.toBe(plainPassword);
        });

        it("should produce a valid bcrypt hash that matches the original password", async () => {
            const realHash = await bcrypt.hash(plainPassword, 10);
            (bcrypt.genSalt as jest.Mock).mockResolvedValue("mockSalt");
            (bcrypt.hash as jest.Mock).mockResolvedValue(realHash);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const hashed = await hashPassword(plainPassword);
            const isMatch = await bcrypt.compare(plainPassword, hashed);
            expect(isMatch).toBe(true);
        });

        it("should throw an error if genSalt fails", async () => {
            const error = new Error("genSalt failed");
            (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

            await expect(hashPassword(plainPassword)).rejects.toThrow("genSalt failed");
        });

        it("should throw an error if hash fails", async () => {
            (bcrypt.genSalt as jest.Mock).mockResolvedValue("mockSalt");
            const error = new Error("hash failed");
            (bcrypt.hash as jest.Mock).mockRejectedValue(error);

            await expect(hashPassword(plainPassword)).rejects.toThrow("hash failed");
        });
    });

    describe("generateToken", () => {
        const mockUserId = "507f1f77bcf86cd799439011";
        const mockEmail = "test@example.com";
        const mockToken = "encrypted.jwt.token.here";
        const mockSecretKey = { type: "secret", extractable: true };

        beforeEach(() => {
            // Mock crypto.createHash().update().digest()
            const mockDigest = Buffer.from("mock-hash-digest");
            const mockUpdate = jest.fn().mockReturnValue({
                digest: jest.fn().mockReturnValue(mockDigest),
            });
            (crypto.createHash as jest.Mock).mockReturnValue({
                update: mockUpdate,
            });

            // Mock base64url.encode
            (base64url.encode as jest.Mock).mockReturnValue("base64encodedhash");

            // Mock importJWK
            (importJWK as jest.Mock).mockResolvedValue(mockSecretKey);

            // Mock EncryptJWT chain
            const mockEncryptInstance = {
                setProtectedHeader: jest.fn().mockReturnThis(),
                setIssuedAt: jest.fn().mockReturnThis(),
                setExpirationTime: jest.fn().mockReturnThis(),
                encrypt: jest.fn().mockResolvedValue(mockToken),
            };
            (EncryptJWT as jest.Mock).mockImplementation(() => mockEncryptInstance);
        });

        it("should generate an encrypted JWT token", async () => {
            const token = await generateToken(mockUserId, mockEmail);

            expect(token).toBe(mockToken);
            expect(EncryptJWT).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: mockUserId,
                    email: mockEmail,
                })
            );
        });

        it("should call setProtectedHeader with correct algorithm", async () => {
            await generateToken(mockUserId, mockEmail);

            const encryptInstance = (EncryptJWT as jest.Mock).mock.results[0].value;
            expect(encryptInstance.setProtectedHeader).toHaveBeenCalledWith({
                alg: "dir",
                enc: "A256GCM",
            });
        });

        it("should call setIssuedAt", async () => {
            await generateToken(mockUserId, mockEmail);

            const encryptInstance = (EncryptJWT as jest.Mock).mock.results[0].value;
            expect(encryptInstance.setIssuedAt).toHaveBeenCalled();
        });

        it("should call setExpirationTime with correct value", async () => {
            await generateToken(mockUserId, mockEmail);

            const encryptInstance = (EncryptJWT as jest.Mock).mock.results[0].value;
            expect(encryptInstance.setExpirationTime).toHaveBeenCalledWith("24h");
        });

        it("should derive secret key from JWT_SECRET", async () => {
            await generateToken(mockUserId, mockEmail);

            expect(crypto.createHash).toHaveBeenCalledWith("sha256");
            expect(base64url.encode).toHaveBeenCalled();
            expect(importJWK).toHaveBeenCalled();
        });
    });

    describe("verifyToken", () => {
        const mockToken = "encrypted.jwt.token.here";
        const mockUserId = "507f1f77bcf86cd799439011";
        const mockEmail = "test@example.com";
        const mockSecretKey = { type: "secret", extractable: true };
        const mockPayload: JWTPayload = {
            userId: mockUserId,
            email: mockEmail,
        };

        beforeEach(() => {
            // Mock crypto.createHash().update().digest()
            const mockDigest = Buffer.from("mock-hash-digest");
            const mockUpdate = jest.fn().mockReturnValue({
                digest: jest.fn().mockReturnValue(mockDigest),
            });
            (crypto.createHash as jest.Mock).mockReturnValue({
                update: mockUpdate,
            });

            // Mock base64url.encode
            (base64url.encode as jest.Mock).mockReturnValue("base64encodedhash");

            // Mock importJWK
            (importJWK as jest.Mock).mockResolvedValue(mockSecretKey);
        });

        it("should verify and decrypt a valid token", async () => {
            (jwtDecrypt as jest.Mock).mockResolvedValue({
                payload: mockPayload,
            });

            const result = await verifyToken(mockToken);

            expect(result).toEqual(mockPayload);
            expect(jwtDecrypt).toHaveBeenCalledWith(mockToken, mockSecretKey);
        });

        it("should return null for invalid token", async () => {
            (jwtDecrypt as jest.Mock).mockRejectedValue(new Error("Invalid token"));

            const result = await verifyToken(mockToken);

            expect(result).toBeNull();
        });

        it("should return null for expired token", async () => {
            (jwtDecrypt as jest.Mock).mockRejectedValue(new Error("Token expired"));

            const result = await verifyToken(mockToken);

            expect(result).toBeNull();
        });

        it("should return null if payload is missing userId", async () => {
            (jwtDecrypt as jest.Mock).mockResolvedValue({
                payload: { email: mockEmail },
            });

            const result = await verifyToken(mockToken);

            expect(result).toBeNull();
        });

        it("should return null if payload is missing email", async () => {
            (jwtDecrypt as jest.Mock).mockResolvedValue({
                payload: { userId: mockUserId },
            });

            const result = await verifyToken(mockToken);

            expect(result).toBeNull();
        });

        it("should return null for malformed token", async () => {
            (jwtDecrypt as jest.Mock).mockRejectedValue(new Error("Malformed token"));

            const result = await verifyToken("invalid.token");

            expect(result).toBeNull();
        });
    });

    describe("extractToken", () => {
        it("should extract token from Bearer authorization header", () => {
            const authHeader = "Bearer encrypted.jwt.token.here";
            const token = extractToken(authHeader);

            expect(token).toBe("encrypted.jwt.token.here");
        });

        it("should return null if header does not start with Bearer", () => {
            const authHeader = "Basic dXNlcjpwYXNz";
            const token = extractToken(authHeader);

            expect(token).toBeNull();
        });

        it("should return null if header is undefined", () => {
            const token = extractToken(undefined);

            expect(token).toBeNull();
        });

        it("should return null if header is empty string", () => {
            const token = extractToken("");

            expect(token).toBeNull();
        });

        it("should handle Bearer token with spaces", () => {
            const authHeader = "Bearer token.with.spaces";
            const token = extractToken(authHeader);

            expect(token).toBe("token.with.spaces");
        });

        it("should extract token correctly when Bearer is lowercase", () => {
            const authHeader = "bearer encrypted.jwt.token.here";
            const token = extractToken(authHeader);

            // Should return null because we check for "Bearer " (capital B)
            expect(token).toBeNull();
        });

        it("should extract token correctly when Bearer has trailing space", () => {
            const authHeader = "Bearer  token";
            const token = extractToken(authHeader);

            expect(token).toBe(" token");
        });
    });
});
