import "../setup/mocks";
import mongoose from "mongoose";
import UserProfile from "../../models/userProfiles";

const request = require("supertest");
const app = require("../../server");

// Mock auth middlewares
jest.mock("../../middlewares/auth/isAuthenticated", () => ({
    isAuthenticated: (_req: any, _res: any, next: any) => next(),
}));
jest.mock("../../middlewares/auth/isAuthorized", () => ({
    isAuthorized: (_req: any, _res: any, next: any) => next(),
}));

describe("UserProfile Routes", () => {
    const userObjectId = new mongoose.Types.ObjectId();
    const userId = userObjectId.toString();

    const mockProfile = {
        _id: "profile123",
        user: {
            _id: userId,
            email: "",
            displayName: "",
            password: ""
        },
        fullName: "John",
        location: "Boston, MA",
        title: "Software Engineer",
        aboutMe: "I’m driven by the challenge of transforming ideas into actionable solutions.",
        website: "",
        twitter: "",
        github: ""
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return a user profile if found", async () => {
        UserProfile.getProfileByUserId = jest.fn().mockImplementation((receivedId) => {
            expect(receivedId.toString()).toBe(userObjectId.toString());
            return Promise.resolve(mockProfile);
        });

        const response = await request(app).get(`/userprofile/${userId}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockProfile);
    });

    it("should return 404 if profile is not found", async () => {
        UserProfile.getProfileByUserId = jest.fn().mockResolvedValue(null);

        const response = await request(app).get(`/userprofile/${userId}`);
        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({ message: "User profile not found" });
    });

    it("should update and return the updated user profile", async () => {
        const updateData = {
            fullName: "Updated Name",
            location: "New Location",
            title: "Senior Engineer"
        };

        const updatedMockProfile = {
            ...mockProfile,
            ...updateData
        };

        UserProfile.updateUserProfile = jest.fn().mockImplementation((receivedId, data) => {
            expect(receivedId.toString()).toBe(userObjectId.toString());
            expect(data).toEqual(updateData);
            return Promise.resolve(updatedMockProfile);
        });

        const response = await request(app)
            .put(`/userprofile/${userId}`)
            .send(updateData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(updatedMockProfile);
    });
});
