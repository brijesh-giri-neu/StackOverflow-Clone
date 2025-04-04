import React, { useState } from "react";
import ProfileHeader from "./header/headerView";
import ProfileDetails from "./details/detailsView";
import { UserProfileType } from "../../../types/entityTypes";
import { VoidFunctionType } from "../../../types/functionTypes";

interface MainProfileProps {
    userProfile: UserProfileType | null;
    handleLogout: VoidFunctionType;
    handleEditProfile: VoidFunctionType
}

const MainProfile = ({ userProfile, handleLogout, handleEditProfile }: MainProfileProps) => {
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
                handleEditProfile={handleEditProfile}
                handleLogout={handleLogout}
            />
            <ProfileDetails userProfile={userProfile} />
        </div>
    );
};

export default MainProfile;
