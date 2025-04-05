import React from "react";
import "./headerView.css";
import { FaSignOutAlt } from "react-icons/fa";

interface ProfileHeaderProps {
    displayName: string;
    handleLogout: () => void;
}

const LogoutIcon = FaSignOutAlt as React.FC<React.SVGProps<SVGSVGElement>>;

const ProfileHeader = ({ displayName, handleLogout }: ProfileHeaderProps) => {
    return (
        <div className="profile_header">
            <div className="profile_left">
                <img src="/profile.png" alt="User Profile" className="user_icon" />
                <span className="profile_name">{displayName}</span>
            </div>
            <div className="profile_right">
                <button onClick={handleLogout} className="logout_button">
                    <LogoutIcon className="logout_icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;
