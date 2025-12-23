/**
 * Centralized mocks for authentication-related modules.
 * 
 * Usage in test files:
 * ```typescript
 * import "../setup/mocks";
 * import { mockGenerateToken, mockVerifyToken, mockExtractToken } from "../setup/mocks";
 * ```
 * 
 * Note: Import this file BEFORE importing the server or any modules that use authService.
 */

// Mock jose library (used by authService for JWE encryption)
jest.mock("jose", () => {
    const mockEncryptJWT = jest.fn().mockImplementation(() => ({
        setProtectedHeader: jest.fn().mockReturnThis(),
        setIssuedAt: jest.fn().mockReturnThis(),
        setExpirationTime: jest.fn().mockReturnThis(),
        encrypt: jest.fn().mockResolvedValue("mock.encrypted.token"),
    }));

    return {
        EncryptJWT: mockEncryptJWT,
        jwtDecrypt: jest.fn(),
        importJWK: jest.fn().mockResolvedValue({}),
        base64url: {
            encode: jest.fn().mockReturnValue("mockBase64"),
        },
    };
});

// Create mock functions that can be controlled in tests
const mockGenerateTokenFn = jest.fn().mockResolvedValue("mock.encrypted.token");
const mockVerifyTokenFn = jest.fn();
const mockExtractTokenFn = jest.fn();
const mockHashPasswordFn = jest.fn();

// Mock authService
jest.mock("../../services/authService", () => ({
    generateToken: mockGenerateTokenFn,
    verifyToken: mockVerifyTokenFn,
    extractToken: mockExtractTokenFn,
    hashPassword: mockHashPasswordFn,
}));

// Export the mock functions so tests can control them
export const mockGenerateToken = mockGenerateTokenFn;
export const mockVerifyToken = mockVerifyTokenFn;
export const mockExtractToken = mockExtractTokenFn;
export const mockHashPassword = mockHashPasswordFn;

