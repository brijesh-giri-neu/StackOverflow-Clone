import mongoose from "mongoose";
import { IUserProfileDocument, IUserProfileModel } from "../../types/types";

/**
 * The schema for a document in the UserProfile collection.
 * 
 * @type {mongoose.Schema<IUserProfileDocument, IUserProfileModel>}
 * 
 * @property {mongoose.Schema.Types.ObjectId} user - A reference to the User document (Required, unique).
 * @property {string} fullName - The user's full name.
 * @property {string} [location] - The user's location.
 * @property {string} [title] - The user's title or professional role.
 * @property {string} [aboutMe] - A short bio or description of the user.
 * @property {string} [website] - The user's personal or professional website link.
 * @property {string} [twitter] - The user's Twitter (X) profile link.
 * @property {string} [github] - The user's GitHub profile link.
 */
const UserProfileSchema = new mongoose.Schema<IUserProfileDocument, IUserProfileModel>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        fullName: { type: String },
        location: { type: String },
        title: { type: String },
        aboutMe: { type: String },
        website: { type: String },
        twitter: { type: String },
        github: { type: String },
    },
    { collection: "UserProfile" }
);

export default UserProfileSchema;
