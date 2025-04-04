import { useState } from "react";
import { UserProfileType } from "../types/entityTypes";
import { VoidFunctionType } from "../types/functionTypes";

interface UseEditProfileProps {
    userProfile: UserProfileType;
    setProfilePage: VoidFunctionType;
}

export const useEditProfile = ({ userProfile, setProfilePage }: UseEditProfileProps) => {
    const [displayName, setDisplayName] = useState<string>(userProfile.displayName);
    const [fullName, setFullName] = useState<string>(userProfile.fullName);
    const [location, setLocation] = useState<string>(userProfile.location || "");
    const [title, setTitle] = useState<string>(userProfile.title || "");
    const [aboutMe, setAboutMe] = useState<string>(userProfile.aboutMe || "");
    const [website, setWebsite] = useState<string>(userProfile.website || "");
    const [twitter, setTwitter] = useState<string>(userProfile.twitter || "");
    const [github, setGithub] = useState<string>(userProfile.github || "");

    const [displayNameErr, setDisplayNameErr] = useState<string>("");
    const [aboutMeErr, setAboutMeErr] = useState<string>("");

    const handleSave = async () => {
        let isValid = true;

        if (!displayName) {
            setDisplayNameErr("Display Name cannot be empty");
            isValid = false;
        } else {
            setDisplayNameErr("");
        }

        if (aboutMe.length > 500) {
            setAboutMeErr("About Me cannot exceed 500 characters");
            isValid = false;
        } else {
            setAboutMeErr("");
        }

        if (!isValid) return;

        const updatedProfile: UserProfileType = {
            email: userProfile.email,
            displayName,
            fullName,
            location,
            title,
            aboutMe,
            website,
            twitter,
            github,
        };

        // API call to update the profile can be added here.
        console.log(updatedProfile);

        // Trigger to switch the view after a successful save.
        setProfilePage();
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
        aboutMeErr,
        handleSave,
    };
};
