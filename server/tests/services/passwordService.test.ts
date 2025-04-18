import { hashPassword } from "../../services/passwordService"; // Adjust path based on your project structure
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
    genSalt: jest.fn(),
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe("hashPassword", () => {
    const plainPassword = "securePass123";

    beforeEach(() => {
        jest.clearAllMocks();
    });

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
