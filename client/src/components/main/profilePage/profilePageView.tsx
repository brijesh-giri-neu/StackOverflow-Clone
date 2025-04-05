import React, { useState } from "react";
import ProfileHeader from "./header/headerView";
import ProfileDetails from "./details/detailsView";
import { UserProfileType } from "../../../types/entityTypes";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useUserLogout } from "../../../hooks/useUserLogout";

interface MainProfileProps {
    userProfile: UserProfileType | null;
    handleLogout: VoidFunctionType;
    setEditUserProfilePage: VoidFunctionType
}

const MainProfile = ({ userProfile, handleLogout, setEditUserProfilePage }: MainProfileProps) => {
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
                setEditUserProfilePage={setEditUserProfilePage}
                handleLogout={logoutUser}
            />
            <ProfileDetails userProfile={userProfile} />
        </div>
    );
};

export default MainProfile;
