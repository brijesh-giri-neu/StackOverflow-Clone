import { useEffect, useState } from "react";
import { getUserProfile } from "../services/userProfileService";
import { UserProfileResponseType } from "../types/entityTypes";

/**
 * A custom hook to fetch a user profile by its userId.
 *
 * @param {string | undefined} userId - The unique identifier of the user whose profile is to be fetched.
 * 
 * @returns {{
*   profile: UserProfileResponseType | null
* }} An object containing:
* - `profile`: The fetched user profile if available, otherwise `null`.
*/
export const useUserProfile = (userId: string | undefined) => {
    const [profile, setProfile] = useState<UserProfileResponseType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(userId){
                    const res = await getUserProfile(userId);
                    setProfile(res || null);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };
        fetchData();
    }, [userId]);

    return { profile };
};
