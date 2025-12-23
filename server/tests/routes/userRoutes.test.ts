// Import mocks FIRST before any other imports
import "../setup/mocks";
import { mockGenerateToken } from "../setup/mocks";

import mongoose from "mongoose";
import User from "../../models/users";
import { IUser } from "../../types/types";

const request = require("supertest");
// Import server AFTER mocks are set up
const app = require("../../server");

describe("User Routes", () => {
    const testUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        email: "test@example.com",
        displayName: "TestUser",
        password: "hashed_password",
        isDeleted: false
    };

    beforeAll(() => {
        // Don't suppress console.log for debugging
    });

    beforeEach(() => {
        // Reset mocks before each test
        mockGenerateToken.mockClear();
        mockGenerateToken.mockResolvedValue("mock.encrypted.token");
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /user/register", () => {
        it("should register a new user", async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            // registerUser returns an IUser object (converted via convertToIUser)
            // Ensure it has _id and email properties
            const registeredUser = {
                _id: testUser._id,
                email: testUser.email,
                displayName: testUser.displayName,
                password: testUser.password
            };
            User.registerUser = jest.fn().mockResolvedValue(registeredUser);
            // Set up generateToken mock - override default for this test
            mockGenerateToken.mockResolvedValue("mock.token.here");

            const response = await request(app)
                .post("/user/register")
                .send({
                    email: testUser.email,
                    displayName: testUser.displayName,
                    password: "testpass123"
                });


            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("message", "Registration successful");
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token", "mock.token.here");
            expect(response.body.user).toMatchObject({
                _id: testUser._id,
                email: testUser.email,
                displayName: testUser.displayName
            });
            expect(mockGenerateToken).toHaveBeenCalledWith(testUser._id, testUser.email);
        });

        it("should return 400 if email is already registered", async () => {
            User.findOne = jest.fn().mockResolvedValue(testUser);

            const response = await request(app)
                .post("/user/register")
                .send({
                    email: testUser.email,
                    displayName: testUser.displayName,
                    password: "testpass123"
                });

            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual({ message: "Email already registered" });
        });
    });

    describe("POST /user/login", () => {
        it("should login with correct credentials", async () => {
            User.loginUser = jest.fn().mockResolvedValue(testUser);

            const response = await request(app)
                .post("/user/login")
                .send({
                    email: testUser.email,
                    password: "testpass123"
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
            expect(response.body).toHaveProperty("user");
        });

        it("should return 401 on invalid credentials", async () => {
            User.loginUser = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .post("/user/login")
                .send({
                    email: testUser.email,
                    password: "wrongpass"
                });

            expect(response.statusCode).toBe(401);
            expect(response.body).toEqual({ message: "Invalid credentials" });
        });

        it("should return 500 on login error", async () => {
            User.loginUser = jest.fn().mockRejectedValue(new Error("DB failure"));

            const response = await request(app)
                .post("/user/login")
                .send({
                    email: testUser.email,
                    password: "testpass123"
                });

            expect(response.statusCode).toBe(500);
            expect(response.body).toHaveProperty("message");
        });
    });

    describe("POST /user/logout", () => {
        it("should logout successfully", async () => {
            const agent = request.agent(app);

            const response = await agent.post("/user/logout");
            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ message: "Logout successful" });
        });
    });

    describe("GET /user/session", () => {
        const testUser = {
            _id: new mongoose.Types.ObjectId().toString(),
            email: "test@example.com",
            displayName: "TestUser",
            password: "hashed_password"
        };

        it("should return 401 if no session exists", async () => {
            const response = await request(app).get("/user/session");
            expect(response.statusCode).toBe(401);
            // isAuthenticated middleware returns "Unauthorized", not "Not authenticated"
            expect(response.body).toEqual({ message: "Unauthorized" });
        });

        it("should return the user if session is valid", async () => {
            const agent = request.agent(app);

            // 1. Mock loginUser and register session via login
            User.loginUser = jest.fn().mockResolvedValue(testUser);
            mockGenerateToken.mockResolvedValue("mock.token.here");

            await agent.post("/user/login").send({
                email: testUser.email,
                password: "testpass123"
            });

            // 2. Mock getUserById
            User.getUserById = jest.fn().mockResolvedValue(testUser);
            mockGenerateToken.mockResolvedValue("new.mock.token.here");

            // 3. Call session endpoint
            const response = await agent.get("/user/session");

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty("user");
            expect(response.body).toHaveProperty("token", "new.mock.token.here");
            expect(response.body.user).toEqual(testUser);
        });

        it("should return 404 if user not found in session", async () => {
            const agent = request.agent(app);

            // Mock login to set session
            User.loginUser = jest.fn().mockResolvedValue(testUser);
            await agent.post("/user/login").send({
                email: testUser.email,
                password: "testpass123"
            });

            // Mock user not found
            User.getUserById = jest.fn().mockResolvedValue(null);

            const response = await agent.get("/user/session");

            expect(response.statusCode).toBe(404);
            expect(response.body).toEqual({ message: "User not found" });
        });
    });

    describe("DELETE /user/delete", () => {
        it("should delete the authenticated user and logout", async () => {
            const agent = request.agent(app);

            // Mock user data
            const user = {
                _id: new mongoose.Types.ObjectId().toString(),
                email: "delete_test@example.com",
                displayName: "DeleteTestUser",
                password: "testpass123"
            };

            // Mock user registration and login
            User.findOne = jest.fn().mockResolvedValue(null); // For register
            User.registerUser = jest.fn().mockResolvedValue(user);
            User.loginUser = jest.fn().mockResolvedValue(user);
            User.getUserById = jest.fn().mockResolvedValue(user); // for session
            User.deleteUserById = jest.fn().mockResolvedValue(undefined); // for delete

            // Register
            await agent.post("/user/register").send({
                email: user.email,
                displayName: user.displayName,
                password: user.password
            });

            // Login
            await agent.post("/user/login").send({
                email: user.email,
                password: user.password
            });

            // Delete
            const res = await agent.delete("/user/delete");

            expect(User.deleteUserById).toHaveBeenCalledWith(user._id);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ message: "Account deleted successfully" });

            // Verify session is cleared - isAuthenticated middleware returns "Unauthorized"
            const sessionRes = await agent.get("/user/session");
            expect(sessionRes.statusCode).toBe(401);
            expect(sessionRes.body).toEqual({ message: "Unauthorized" });
        });
    });

});
