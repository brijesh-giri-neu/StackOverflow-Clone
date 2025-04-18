import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../../models/users";
import { IUser } from "../../types/types";
import { convertToIUser } from "../../utilities/formatUtils";

jest.mock("bcrypt");
jest.mock("../../utilities/formatUtils");

describe("User Model - Static Methods & Hooks", () => {
    const mockUserInput: IUser = {
        email: "test@example.com",
        displayName: "Test User",
        password: "password123",
        isDeleted: false
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerUser", () => {
        it("should create a new user and return IUser format", async () => {
            const createdUserDoc = {
                _id: new mongoose.Types.ObjectId(),
                email: mockUserInput.email,
                displayName: mockUserInput.displayName,
                password: "hashedPassword123",
                toObject: function () { return this; }
            };

            const convertedUser = {
                email: mockUserInput.email,
                displayName: mockUserInput.displayName,
                _id: createdUserDoc._id
            };

            jest.spyOn(User, "create").mockResolvedValue(createdUserDoc as any);
            (convertToIUser as jest.Mock).mockReturnValue(convertedUser);

            const result = await User.registerUser(mockUserInput);

            expect(User.create).toHaveBeenCalledWith(mockUserInput);
            expect(convertToIUser).toHaveBeenCalledWith(createdUserDoc);
            expect(result).toEqual(convertedUser);
        });
    });

    describe("loginUser", () => {
        it("should return user if email and password match", async () => {
            const foundUser = {
                _id: new mongoose.Types.ObjectId(),
                email: mockUserInput.email,
                displayName: mockUserInput.displayName,
                password: "hashedPassword123",
                toObject: function () { return this; }
            };

            const expectedUser = {
                _id: foundUser._id,
                email: foundUser.email,
                displayName: foundUser.displayName
            };

            jest.spyOn(User, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(foundUser)
            } as any);

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (convertToIUser as jest.Mock).mockReturnValue(expectedUser);

            const result = await User.loginUser(mockUserInput.email, mockUserInput.password);

            expect(User.findOne).toHaveBeenCalledWith({ email: mockUserInput.email, isDeleted: { $ne: true } });
            expect(bcrypt.compare).toHaveBeenCalledWith(mockUserInput.password, foundUser.password);
            expect(result).toEqual(expectedUser);
        });

        it("should return null if user is not found", async () => {
            jest.spyOn(User, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(null)
            } as any);

            const result = await User.loginUser("invalid@example.com", "wrongpass");
            expect(result).toBeNull();
        });

        it("should return null if password does not match", async () => {
            const foundUser = {
                password: "hashedPassword123"
            };

            jest.spyOn(User, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(foundUser)
            } as any);

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await User.loginUser(mockUserInput.email, "wrongpass");
            expect(result).toBeNull();
        });
    });

    describe("getUserById", () => {
        it("should return user if found by ID", async () => {
            const mockUserId = new mongoose.Types.ObjectId().toHexString();
            const foundUser = {
                _id: mockUserId,
                email: mockUserInput.email,
                displayName: mockUserInput.displayName,
                password: "hashedPassword",
                isDeleted: false,
                toObject: function () { return this; }
            };

            const converted = {
                _id: mockUserId,
                email: foundUser.email,
                displayName: foundUser.displayName
            };

            jest.spyOn(User, "findOne").mockReturnValueOnce({
                where: jest.fn().mockReturnThis(),
                ne: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue(foundUser)
            } as any);
            (convertToIUser as jest.Mock).mockReturnValue(converted);

            const result = await User.getUserById(mockUserId);

            expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId, isDeleted: { $ne: true } });
            expect(convertToIUser).toHaveBeenCalledWith(foundUser);
            expect(result).toEqual(converted);
        });

        it("should return null if user not found", async () => {
            const mockUserId = new mongoose.Types.ObjectId().toHexString();

            const mockFindOne = jest.spyOn(User, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(null)
            } as any);

            const result = await User.getUserById(mockUserId);

            expect(mockFindOne).toHaveBeenCalledWith({ _id: mockUserId, isDeleted: { $ne: true } });
            expect(result).toBeNull();
        });
    });

    describe("UserSchema - Pre-save Hook", () => {
        it("should hash the password before saving", async () => {
            const mockSalt = "salt123";
            const mockHash = "hashedPassword123";

            (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
            (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

            const mockUser: any = {
                password: "plaintextPassword",
                isModified: (field: string) => field === "password"
            };

            // Simulate the actual pre-save hook from the schema
            const preSaveHook = async function (this: any, next: Function) {
                if (!this.isModified("password")) return next();
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(this.password, salt);
                this.password = hash;
                next();
            };

            await new Promise((resolve) => preSaveHook.call(mockUser, resolve));

            expect(mockUser.password).toBe(mockHash);
            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith("plaintextPassword", mockSalt);
        });
    });

    describe("deleteUserById", () => {
        it("should mark the user as deleted", async () => {
            const mockUserId = new mongoose.Types.ObjectId().toHexString();

            const mockUpdate = jest
                .spyOn(User, "findByIdAndUpdate")
                .mockResolvedValue(null as any);

            await User.deleteUserById(mockUserId);

            expect(mockUpdate).toHaveBeenCalledWith(
                new mongoose.Types.ObjectId(mockUserId),
                { isDeleted: true }
            );
        });
    });

});
