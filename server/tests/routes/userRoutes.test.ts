import mongoose from "mongoose";
import User from "../../models/users";
const request = require("supertest");
const app = require("../../server");

describe("User Routes", () => {
    const testUser = {
        _id: new mongoose.Types.ObjectId().toString(),
        email: "test@example.com",
        displayName: "TestUser",
        password: "hashed_password"
    };

    beforeAll(() => {
        jest.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /user/register", () => {
        it("should register a new user", async () => {
            User.findOne = jest.fn().mockResolvedValue(null);
            User.registerUser = jest.fn().mockResolvedValue(testUser);

            const response = await request(app)
                .post("/user/register")
                .send({
                    email: testUser.email,
                    displayName: testUser.displayName,
                    password: "testpass123"
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                _id: testUser._id,
                email: testUser.email,
                displayName: testUser.displayName
            });
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
            expect(response.body).toEqual({ message: "Not authenticated" });
        });

        it("should return the user if session is valid", async () => {
            const agent = request.agent(app);

            // 1. Mock loginUser and register session via login
            User.loginUser = jest.fn().mockResolvedValue(testUser);

            await agent.post("/user/login").send({
                email: testUser.email,
                password: "testpass123"
            });

            // 2. Mock getUserById
            User.getUserById = jest.fn().mockResolvedValue(testUser);

            // 3. Call session endpoint
            const response = await agent.get("/user/session");

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({ user: testUser });
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

});
