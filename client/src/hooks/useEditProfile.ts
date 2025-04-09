import { useState } from "react";
import { UserProfileType } from "../types/entityTypes";
import { UserProfileObjFunctionType } from "../types/functionTypes";
import { upsertUserProfile } from "../services/userProfileService";

interface UseEditProfileProps {
    userProfile: UserProfileType;
    setProfilePage: UserProfileObjFunctionType;
}

/**
 * Custom hook for editing a user profile.
 * It manages form state for profile fields and performs validation before saving.
 *
 * @param {UseEditProfileProps} props - The current user profile and a function to switch the view.
 * @returns An object containing profile field state, error messages, and a handleSave function.
 */
export const useEditProfile = ({ userProfile, setProfilePage }: UseEditProfileProps) => {
    const [displayName, setDisplayName] = useState<string>(userProfile.user.displayName);
    const [fullName, setFullName] = useState<string>(userProfile.fullName);
    const [location, setLocation] = useState<string>(userProfile.location || "");
    const [title, setTitle] = useState<string>(userProfile.title || "");
    const [aboutMe, setAboutMe] = useState<string>(userProfile.aboutMe || "");
    const [website, setWebsite] = useState<string>(userProfile.website || "");
    const [twitter, setTwitter] = useState<string>(userProfile.twitter || "");
    const [github, setGithub] = useState<string>(userProfile.github || "");

    const [displayNameErr, setDisplayNameErr] = useState<string>("");
    // const [aboutMeErr, setAboutMeErr] = useState<string>("");

    const handleSave = async () => {
        let isValid = true;

        if (!displayName) {
            setDisplayNameErr("Display Name cannot be empty");
            isValid = false;
        } else {
            setDisplayNameErr("");
        }

        // if (aboutMe.length > 500) {
        //     setAboutMeErr("About Me cannot exceed 500 characters");
        //     isValid = false;
        // } else {
        //     setAboutMeErr("");
        // }

        if (!isValid) return;

        const updatedProfile: UserProfileType = {
            user: {
                _id: userProfile.user._id,
                email: userProfile.user.email,
                displayName: displayName,
                password: userProfile.user.password, // Retain existing password; not editable here
            },
            fullName,
            location,
            title,
            aboutMe,
            website,
            twitter,
            github,
        };
        upsertUserProfile(updatedProfile);
        setProfilePage(updatedProfile);
    };

    return {
        displayName,
        setDisplayName,
        fullName,
        setFullName,
        location,
        setLocation,
        title,
        setTitle,
        aboutMe,
        setAboutMe,
        website,
        setWebsite,
        twitter,
        setTwitter,
        github,
        setGithub,
        displayNameErr,
        handleSave,
    };
};
