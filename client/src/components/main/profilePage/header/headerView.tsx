import React from "react";
import "./headerView.css";
import { FaPencilAlt, FaSignOutAlt, FaTrashAlt } from "react-icons/fa";

/**
 * Props for the ProfileHeader component.
 * Includes user display name and handlers for profile actions.
 */
interface ProfileHeaderProps {
    displayName: string;
    setEditUserProfilePage: () => void;
    handleLogout: () => void;
    handleProfileDelete: () => void;
}

const PencilIcon = FaPencilAlt as React.FC<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = FaSignOutAlt as React.FC<React.SVGProps<SVGSVGElement>>;
const BinIcon = FaTrashAlt as React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * Displays the user profile header with avatar, name, and action buttons.
 *
 * @param displayName - The display name of the user.
 * @param setEditUserProfilePage - Callback to trigger the "Edit Profile" view.
 * @param handleLogout - Callback to log the user out.
 * @param handleProfileDelete - Callback to delete the user's profile.
 * @returns A React component showing profile info and controls.
 */
const ProfileHeader = ({
    displayName,
    setEditUserProfilePage,
    handleLogout,
    handleProfileDelete,
}: ProfileHeaderProps) => {
    return (
        <div className="profile_header">
            <div className="profile_left">
                <img src="/profile.png" alt="User" className="user_icon" />
                <h2 className="profile_name">{displayName}</h2>
            </div>
            <div className="profile_actions">
                <button onClick={setEditUserProfilePage} className="edit_profile_button">
                    <PencilIcon className="button_icon" />
                    <span>Edit Profile</span>
                </button>
                <button onClick={handleProfileDelete} className="delete_profile_button">
                    <BinIcon className="button_icon" />
                    <span>Delete Profile</span>
                </button>
                <button onClick={handleLogout} className="logout_button">
                    <LogoutIcon className="button_icon" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;