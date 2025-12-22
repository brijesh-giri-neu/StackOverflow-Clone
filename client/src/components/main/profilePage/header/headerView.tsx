import React, { useState } from "react";
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
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const onConfirmDelete = async () => {
        setShowDeleteModal(false);
        handleProfileDelete();
    };

    const onConfirmLogout = async () => {
        setShowLogoutModal(false);
        handleLogout();
    };

    return (
        <>
            <div className="profile_header">
                <div className="profile_left">
                    <img src="/profile.png" alt="User" className="user_icon" />
                    <span className="profile_name">{displayName}</span>
                </div>
                <div className="profile_actions">
                    <button onClick={setEditUserProfilePage} className="edit_profile_button">
                        <PencilIcon className="button_icon" />
                        <span>Edit Profile</span>
                    </button>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="delete_profile_button"
                    >
                        <BinIcon className="button_icon" />
                        <span>Delete Profile</span>
                    </button>
                    <button onClick={() => setShowLogoutModal(true)} className="logout_button">
                        <LogoutIcon className="button_icon" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {showDeleteModal && (
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
                                    <h5 className="modal-title">Delete profile</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Close"
                                        onClick={() => setShowDeleteModal(false)}
                                    />
                                </div>
                                <div className="modal-body">
                                    <p>
                                        Are you sure you want to delete your profile? This action
                                        cannot be undone.
                                    </p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={onConfirmDelete}
                                    >
                                        Delete profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show" />
                </>
            )}

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