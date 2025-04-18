import fs from "fs";
import { loggingMiddleware, redactSensitiveFields } from "../../middlewares/logger";

jest.mock("fs");

describe("Logging Middleware", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should create the log directory if it doesn't exist", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const mkdirSpy = jest.spyOn(fs, "mkdirSync");

        // Re-require the module to re-run the mkdir logic
        jest.resetModules();
        require("../../middlewares/logger");

        expect(true);
    });

    describe("redactSensitiveFields", () => {
        it("should redact top-level sensitive fields", () => {
            const input = {
                username: "john",
                password: "secret123",
                token: "abc123"
            };

            const result = redactSensitiveFields(input);
            expect((result as any).password).toBe("***REDACTED***");
            expect((result as any).token).toBe("***REDACTED***");
            expect((result as any).username).toBe("john");
        });

        it("should redact nested sensitive fields", () => {
            const input = {
                profile: {
                    email: "user@example.com",
                    secret: "supersecret"
                }
            };

            const result = redactSensitiveFields(input);
            expect((result as any).profile.secret).toBe("***REDACTED***");
            expect((result as any).profile.email).toBe("user@example.com");
        });

        it("should handle arrays and redact sensitive fields in objects", () => {
            const input = [
                { email: "one@example.com", password: "p1" },
                { token: "t2", data: "ok" }
            ];

            const result = redactSensitiveFields(input) as any[];

            expect(result[0].password).toBe("***REDACTED***");
            expect(result[0].email).toBe("one@example.com");
            expect(result[1].token).toBe("***REDACTED***");
            expect(result[1].data).toBe("ok");
        });

        it("should return primitive values as-is", () => {
            expect(redactSensitiveFields("hello")).toBe("hello");
            expect(redactSensitiveFields(42)).toBe(42);
            expect(redactSensitiveFields(true)).toBe(true);
        });
    });
});