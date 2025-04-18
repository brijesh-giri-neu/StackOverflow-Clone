import ProfileHeader from "./header/headerView";
import ProfileDetails from "./details/detailsView";
import { UserProfileType } from "../../../types/entityTypes";
import { VoidFunctionType } from "../../../types/functionTypes";
import { useUserLogout, useUserDelete } from "../../../hooks/useUserLogout";

interface MainProfileProps {
    userProfile: UserProfileType | null;
    handleLogout: VoidFunctionType;
    setEditUserProfilePage: VoidFunctionType
}

const MainProfile = ({ userProfile, handleLogout, setEditUserProfilePage }: MainProfileProps) => {
    const { logoutUser } = useUserLogout(handleLogout);
    const { deleteUser } = useUserDelete(handleLogout);

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
                setEditUserProfilePage={setEditUserProfilePage}
                handleLogout={logoutUser}
                handleProfileDelete={deleteUser}
            />
            <ProfileDetails userProfile={userProfile} />
        </div>
    );
};

export default MainProfile;
