import React, { useState } from "react";
import "./headerView.css";
import { FaSignOutAlt } from "react-icons/fa";

/**
 * Props for the ProfileHeader component used in edit mode.
 * Includes the user's display name and a logout handler.
 */
interface ProfileHeaderProps {
    displayName: string;
    handleLogout: () => void;
}

const LogoutIcon = FaSignOutAlt as React.FC<React.SVGProps<SVGSVGElement>>;

/**
 * Displays a profile header with the user's name and a logout button.
 */
const ProfileHeader = ({ displayName, handleLogout }: ProfileHeaderProps) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const onConfirmLogout = async () => {
        setShowLogoutModal(false);
        handleLogout();
    };

    return (
        <>
            <div className="profile_header">
                <div className="profile_left">
                    <img src="/profile.png" alt="User Profile" className="user_icon" />
                    <span className="profile_name">{displayName}</span>
                </div>
                <div className="profile_right">
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="logout_button"
                    >
                        <LogoutIcon className="logout_icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {showLogoutModal && (
                <>
                    <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Log out</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowLogoutModal(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to log out?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowLogoutModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={onConfirmLogout}
                                    >
                                        Log out
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}
        </>
    );
};

export default ProfileHeader;
