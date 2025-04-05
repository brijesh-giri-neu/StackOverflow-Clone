import React, { useState } from "react";
import ProfileHeader from "./header/headerView";
import EditProfilePage from "./editProfile/editProfileView";
import { UserProfileType } from "../../../types/entityTypes";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useUserLogout } from "../../../hooks/useUserLogout";

interface EditProfileProps {
    userProfile: UserProfileType | null;
    setProfilePage: VoidFunctionType;
    handleLogout: VoidFunctionType;
}

const EditProfile = ({ userProfile, setProfilePage, handleLogout }: EditProfileProps) => {
    const { logoutUser } = useUserLogout(handleLogout);
    if (!userProfile) {
        return (
            <div className="main_profile">
                <h2>You are not logged in</h2>
            </div>
        );
    }
    
    return (
        <div className="main_profile">
            <ProfileHeader
                displayName={userProfile.displayName}
                handleLogout={logoutUser}
            />
            <EditProfilePage userProfile={userProfile} setProfilePage={setProfilePage} />
        </div>
    );
};

export default EditProfile;
