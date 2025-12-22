import mongoose from "mongoose";
import UserProfileSchema from "./schema/userProfile";
import { IUserProfile, IUserProfileDocument, IUserProfileModel } from "../types/types";
import { convertToIUserProfile } from "../utilities/formatUtils";

/**
 * Static Method: getProfileByUserId
 * Retrieves the user profile associated with the given user's ObjectId.
 * 
 * @param {mongoose.Types.ObjectId} userId - The user's ObjectId.
 * @returns {Promise<IUserProfile | null>} - The user profile if found, or null.
 */
UserProfileSchema.statics.getProfileByUserId = async function (
    userId: mongoose.Types.ObjectId
): Promise<IUserProfile | null> {
    const profileDoc = await this.findOne({ user: userId }).exec();
    if (!profileDoc) return null;
    return convertToIUserProfile(profileDoc);
};

/**
 * Static Method: updateUserProfile
 * Updates the profile information for the given user's ObjectId.
 * 
 * @param {mongoose.Types.ObjectId} userId - The user's ObjectId.
 * @param {IUserProfile} profile - The updated profile information.
 * @returns {Promise<IUserProfile>} - The updated user profile.
 */
UserProfileSchema.statics.updateUserProfile = async function (
    userId: mongoose.Types.ObjectId,
    profile: IUserProfile
): Promise<IUserProfile> {
    const updateData = { ...profile, user: userId };

    const updatedProfile = await this.findOneAndUpdate(
        { user: userId },
        updateData,
        { new: true, runValidators: true, upsert: true }
    ).lean().exec();

    if (!updatedProfile) {
        throw new Error("Failed to create/update user profile");
    }

    return convertToIUserProfile(updatedProfile as unknown as IUserProfileDocument);
};

/**
 * The UserProfile model representing the UserProfiles collection in MongoDB.
 * 
 * @type {mongoose.Model<IUserProfileDocument, IUserProfileModel>}
 */
const UserProfile = mongoose.model<IUserProfileDocument, IUserProfileModel>("UserProfile", UserProfileSchema);
export default UserProfile;
