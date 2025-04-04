
import { UserProfileType } from "../../../../types/entityTypes";
import { VoidFunctionType } from "../../../../types/functionTypes";
import { useEditProfile } from "../../../../hooks/useEditProfile";

import Form from "../../baseComponents/form/formView";
import Input from "../../baseComponents/input/inputView";
import Textarea from "../../baseComponents/textarea/textAreaView";

import "./editProfileView.css";

interface EditProfilePageProps {
    userProfile: UserProfileType;
    setProfilePage: VoidFunctionType;
}

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
        fullNameErr,
        aboutMeErr,
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
                />
                <Input
                    title="Location"
                    id="location"
                    val={location}
                    setState={setLocation}
                />
                <Input
                    title="Title"
                    id="title"
                    val={title}
                    setState={setTitle}
                />
                <Textarea
                    title="About me"
                    id="aboutMe"
                    val={aboutMe}
                    setState={setAboutMe}
                    err={aboutMeErr}
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
                />
                <Input
                    title="X link or username"
                    id="twitter"
                    val={twitter}
                    setState={setTwitter}
                />
                <Input
                    title="GitHub link or username"
                    id="github"
                    val={github}
                    setState={setGithub}
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
                    err={fullNameErr}
                />
                {/* Add any other private fields here */}
            </div>

            {/* ===== Submit Button & Info ===== */}
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={handleSave}>
                    Save Profile
                </button>
            </div>
        </Form>
    );
};

export default EditProfilePage;
