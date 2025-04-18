import { useEffect } from "react";
import { getUserSession } from "../services/userService";
import { getUserProfile } from "../services/userProfileService";
import { UserObjFunctionType, UserProfileObjFunctionType } from "../types/functionTypes";


/**
 * A custom React hook that attempts to restore the logged-in user's session on initial load.
 * 
 * If a valid session is found, it sets both the user and the user's profile in the app state.
 * Falls back to an empty profile if user profile retrieval fails.
 *
 * @param {UserObjFunctionType} setUser - Function to update the logged-in user in state.
 * @param {UserProfileObjFunctionType} setUserProfile - Function to update the user's profile in state.
 */
export const useUserSession = (
    setUser: UserObjFunctionType,
    setUserProfile: UserProfileObjFunctionType
) => {
    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const loggedInUser = await getUserSession();
                if (loggedInUser) {
                    setUser(loggedInUser);
                    try {
                        const fetchedProfile = await getUserProfile(loggedInUser._id);
                        setUserProfile({
                            user: loggedInUser,
                            fullName: fetchedProfile?.fullName ?? "",
                            location: fetchedProfile?.location ?? "",
                            title: fetchedProfile?.title ?? "",
                            aboutMe: fetchedProfile?.aboutMe ?? "",
                            website: fetchedProfile?.website ?? "",
                            twitter: fetchedProfile?.twitter ?? "",
                            github: fetchedProfile?.github ?? "",
                        });
                    } catch {
                        // fallback to empty profile if profile fetch fails
                        setUserProfile({
                            user: loggedInUser,
                            fullName: "",
                            location: "",
                            title: "",
                            aboutMe: "",
                            website: "",
                            twitter: "",
                            github: "",
                        });
                    }
                }
            } catch(error) {
                console.log("An error occured during fetching user session "+error);
            }
        };

        fetchSessionUser();
    }, [setUser, setUserProfile]);
};
