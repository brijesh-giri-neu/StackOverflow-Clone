import ProfileHeader from "./header/headerView";
import EditProfilePage from "./editProfile/editProfileView";
import { UserProfileType } from "../../../types/entityTypes";
import { UserProfileObjFunctionType, VoidFunctionType } from "../../../types/functionTypes";
import { useUserLogout } from "../../../hooks/useUserLogout";

/**
 * Props for the EditProfile component.
 * Includes user profile data, a setter for switching back to profile view, and a logout handler.
 */
interface EditProfileProps {
    userProfile: UserProfileType | null;
    setProfilePage: UserProfileObjFunctionType;
    handleLogout: VoidFunctionType;
}

/**
 * Renders the edit profile page if user is logged in, or a fallback message otherwise.
 * Includes header with logout and profile editing form.
 */
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
                displayName={userProfile.user.displayName}
                handleLogout={logoutUser}
            />
            <EditProfilePage userProfile={userProfile} setProfilePage={setProfilePage} />
        </div>
    );
};

export default EditProfile;
