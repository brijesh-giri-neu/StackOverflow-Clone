import { useEffect } from "react";
import { getUserSession } from "../services/userService";
import { getUserProfile } from "../services/userProfileService";
import { UserObjFunctionType, UserProfileObjFunctionType } from "../types/functionTypes";

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
