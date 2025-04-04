import mongoose from "mongoose";
import { IUserProfileDocument, IUserProfileModel } from "../../types/types";

/**
 * The schema for a document in the UserProfile collection.
 * 
 * @property {mongoose.Schema.Types.ObjectId} user - A reference to the User document (Required, unique).
 * @property {string} fullName - The user's full name (Required).
 * @property {string} [location] - The user's location.
 * @property {string} [title] - The user's title or professional role.
 * @property {string} [aboutMe] - A short bio or description of the user.
 * @property {string} [website] - The user's personal or professional website link.
 * @property {string} [twitter] - The user's Twitter (X) profile link.
 * @property {string} [github] - The user's GitHub profile link.
 */
const UserProfileSchema = new mongoose.Schema<IUserProfileDocument, IUserProfileModel>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fullName: { type: String, required: true },
        location: { type: String },
        title: { type: String },
        aboutMe: { type: String },
        website: { type: String },
        twitter: { type: String },
        github: { type: String },
    },
    { collection: "UserProfile" }
);

/**
 * Static Method: Get the user profile by the associated user's ObjectId.
 * 
 * @param {mongoose.Types.ObjectId} userId - The ObjectId of the user.
 * @returns {Promise<IUserProfileDocument | null>} - A promise that resolves with the user profile document or null if not found.
 */
UserProfileSchema.statics.getProfileByUserId = async function (
    userId: mongoose.Types.ObjectId
): Promise<IUserProfileDocument | null> {
    return this.findOne({ user: userId }).exec();
};

/**
 * Static Method: Update the user profile information.
 * 
 * @param {mongoose.Types.ObjectId} userId - The ObjectId of the user.
 * @param {Partial<Omit<IUserProfileDocument, "user" | "_id">>} profile - The profile fields to update.
 * @returns {Promise<IUserProfileDocument | null>} - A promise that resolves with the updated user profile document.
 */
UserProfileSchema.statics.updateUserProfile = async function (
    userId: mongoose.Types.ObjectId,
    profile: Partial<Omit<IUserProfileDocument, "user" | "_id">>
): Promise<IUserProfileDocument | null> {
    return this.findOneAndUpdate({ user: userId }, profile, { new: true, runValidators: true }).exec();
};

export default UserProfileSchema;
