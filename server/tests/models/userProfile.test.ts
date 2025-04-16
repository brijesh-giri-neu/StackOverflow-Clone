import mongoose from "mongoose";
import UserProfile from "../../models/userProfiles";
import { convertToIUserProfile } from "../../utilities/formatUtils";

jest.mock("../../utilities/formatUtils");

describe("UserProfile Model - Static Methods", () => {
    const mockUserId = new mongoose.Types.ObjectId();

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getProfileByUserId", () => {
        it("should return user profile if found", async () => {
            const mockProfileDoc = {
                _id: new mongoose.Types.ObjectId(),
                user: mockUserId,
                fullName: "Alice Doe",
                location: "Boston",
                title: "Developer"
            };

            const expected = {
                user: mockUserId,
                fullName: "Alice Doe",
                location: "Boston",
                title: "Developer"
            };

            jest.spyOn(UserProfile, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(mockProfileDoc)
            } as any);

            (convertToIUserProfile as jest.Mock).mockReturnValue(expected);

            const result = await UserProfile.getProfileByUserId(mockUserId);

            expect(UserProfile.findOne).toHaveBeenCalledWith({ user: mockUserId });
            expect(convertToIUserProfile).toHaveBeenCalledWith(mockProfileDoc);
            expect(result).toEqual(expected);
        });

        it("should return null if no profile is found", async () => {
            jest.spyOn(UserProfile, "findOne").mockReturnValueOnce({
                exec: jest.fn().mockResolvedValue(null)
            } as any);

            const result = await UserProfile.getProfileByUserId(mockUserId);
            expect(result).toBeNull();
        });
    });

    describe("updateUserProfile", () => {
        it("should update existing profile and return formatted result", async () => {
            const mockProfileInput = {
                user: mockUserId.toHexString(),
                fullName: "Bob Dev",
                location: "NYC",
                title: "Engineer",
                aboutMe: "Full stack dev",
                website: "https://example.com",
                twitter: "https://twitter.com/dev",
                github: "https://github.com/dev"
            };

            const updatedProfile = {
                ...mockProfileInput,
                user: mockUserId
            };

            const expectedOutput = {
                user: mockUserId,
                fullName: "Bob Dev",
                location: "NYC",
                title: "Engineer"
            };

            jest.spyOn(UserProfile, "findOneAndUpdate").mockReturnValueOnce({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(updatedProfile)
                })
            } as any);

            (convertToIUserProfile as jest.Mock).mockReturnValue(expectedOutput);

            const result = await UserProfile.updateUserProfile(mockUserId, mockProfileInput);

            expect(UserProfile.findOneAndUpdate).toHaveBeenCalledWith(
                { user: mockUserId },
                { ...mockProfileInput, user: mockUserId },
                { new: true, runValidators: true, upsert: true }
            );
            expect(convertToIUserProfile).toHaveBeenCalledWith(updatedProfile);
            expect(result).toEqual(expectedOutput);
        });

        it("should throw error if update fails and no profile is returned", async () => {
            jest.spyOn(UserProfile, "findOneAndUpdate").mockReturnValueOnce({
                lean: () => ({
                    exec: jest.fn().mockResolvedValue(null)
                })
            } as any);

            await expect(
                UserProfile.updateUserProfile(mockUserId, {
                    fullName: "Fail Case"
                } as any)
            ).rejects.toThrow("Failed to create/update user profile");
        });
    });
});
