import { UserProfileType } from "../../../../types/entityTypes";
import { UserProfileObjFunctionType } from "../../../../types/functionTypes";
import { useEditProfile } from "../../../../hooks/useEditProfile";

import Form from "../../baseComponents/form/formView";
import Input from "../../baseComponents/input/inputView";
import Textarea from "../../baseComponents/textarea/textAreaView";

import "./editProfileView.css";

/**
 * Props for the EditProfilePage component.
 * Includes the current user profile and a function to update the profile view.
 */
interface EditProfilePageProps {
    userProfile: UserProfileType;
    setProfilePage: UserProfileObjFunctionType;
}

/**
 * A form-based component that allows users to edit their profile information.
 * Includes public fields, links, private info, and validation on save.
 */
const EditProfilePage = ({ userProfile, setProfilePage }: EditProfilePageProps) => {
    const {
        displayName,
        setDisplayName,
        fullName,
        setFullName,
        location,
        setLocation,
        title,
        setTitle,
        aboutMe,
        setAboutMe,
        website,
        setWebsite,
        twitter,
        setTwitter,
        github,
        setGithub,
        displayNameErr,
        handleSave,
    } = useEditProfile({ userProfile, setProfilePage });

    return (
        <Form>
            {/* ===== Public Information ===== */}
            <h4 className="section_title">Public information</h4>
            <div className="profile_section">
                <Input
                    title="Display name"
                    id="displayName"
                    val={displayName}
                    setState={setDisplayName}
                    err={displayNameErr}
                    mandatory={true}
                />
                <Input
                    title="Location"
                    id="location"
                    val={location}
                    setState={setLocation}
                    mandatory={false}
                />
                <Input
                    title="Title"
                    id="title"
                    val={title}
                    setState={setTitle}
                    mandatory={false}
                />
                <Textarea
                    title="About me"
                    id="aboutMe"
                    val={aboutMe}
                    setState={setAboutMe}
                    mandatory={false}
                />
            </div>

            {/* ===== Links ===== */}
            <h4 className="section_title">Links</h4>
            <div className="profile_section">
                <Input
                    title="Website link"
                    id="website"
                    val={website}
                    setState={setWebsite}
                    mandatory={false}
                />
                <Input
                    title="X link"
                    id="twitter"
                    val={twitter}
                    setState={setTwitter}
                    mandatory={false}
                />
                <Input
                    title="GitHub link"
                    id="github"
                    val={github}
                    setState={setGithub}
                    mandatory={false}
                />
            </div>

            {/* ===== Private Information ===== */}
            <h4 className="section_title">Private information</h4>
            <div className="profile_section">
                <Input
                    title="Full name"
                    id="fullName"
                    val={fullName}
                    setState={setFullName}
                    mandatory={false}
                />
                {/* Add any other private fields here */}
            </div>

            {/* ===== Submit Button & Info ===== */}
            <div className="btn_indicator_container">
                <button className="btn btn-primary form_postBtn" onClick={handleSave}>
                    Save Profile
                </button>
                <div className="mandatory_indicator">* indicates mandatory fields</div>
            </div>
        </Form>
    );
};

export default EditProfilePage;
