import { REACT_APP_API_URL, api } from "./config";
import { UserProfileType, UserProfileResponseType } from "../types/entityTypes";

// The base URL for the user profile API
const USER_PROFILE_API_URL = `${REACT_APP_API_URL}/userProfile`;

/**
 * Retrieves the user profile for the given userId.
 *
 * @param userId - The user's unique identifier as a string.
 * @returns A promise that resolves to the UserProfileResponseType object.
 */
const getUserProfile = async (
    userId: string
): Promise<UserProfileResponseType | null> => {
    try {
        const res = await api.get(`${USER_PROFILE_API_URL}/${userId}`);
        if (res.status !== 200) {
            throw new Error("Error while fetching user profile");
        }
        return res.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

/**
 * Updates the user profile for the given userId.
 *
 * @param updatedProfile - The updated profile data to be saved.
 * @returns A promise that resolves to the updated UserProfileResponseType object.
 */
const upsertUserProfile = async (
    updatedProfile: UserProfileType
): Promise<UserProfileResponseType> => {
    try {
        const userId = updatedProfile.user._id;
        const res = await api.put(`${USER_PROFILE_API_URL}/${userId}`, updatedProfile);
        if (res.status !== 200) {
            throw new Error("Error while updating user profile");
        }
        return res.data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

export { getUserProfile, upsertUserProfile };
