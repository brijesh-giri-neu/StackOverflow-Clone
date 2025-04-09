import React from "react";
import "./headerView.css";
import { FaPencilAlt, FaSignOutAlt } from "react-icons/fa";

interface ProfileHeaderProps {
    displayName: string;
    setEditUserProfilePage: () => void;
    handleLogout: () => void;
}

const PencilIcon = FaPencilAlt as React.FC<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = FaSignOutAlt as React.FC<React.SVGProps<SVGSVGElement>>;

const ProfileHeader = ({
    displayName,
    setEditUserProfilePage,
    handleLogout,
}: ProfileHeaderProps) => {
    return (
        <div className="profile_header">
            <div className="profile_left">
                <img src="/profile.png" alt="User" className="user_icon" />
                <h2 className="profile_name">{displayName}</h2>
            </div>
            <div className="profile_actions">
                <button onClick={setEditUserProfilePage} className="edit_profile_button">
                    <PencilIcon className="button_icon"/>
                    <span>Edit Profile</span>
                </button>
                <button onClick={handleLogout} className="logout_button">
                    <LogoutIcon className="button_icon"/>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;
