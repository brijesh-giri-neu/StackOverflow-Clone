import { useUserRegistration } from "../../../hooks/useUserRegistration";
import Input from "../baseComponents/input/inputView"; // Reuse input component
import Form from "../baseComponents/form/formView"; // Reuse form component
import { UserObjFunctionType, UserProfileObjFunctionType, VoidFunctionType } from "../../../types/functionTypes";

interface UserRegistrationProps {
    setUser: UserObjFunctionType,
    setUserProfile: UserProfileObjFunctionType,
    handleQuestions: VoidFunctionType;
}

const UserRegistration = ({ setUser, setUserProfile, handleQuestions }: UserRegistrationProps) => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        displayName,
        setDisplayName,
        emailErr,
        passwordErr,
        displayNameErr,
        registerUser,
        registrationErr
    } = useUserRegistration(handleQuestions, setUser, setUserProfile);

    return (
        <Form>
            <Input
                title="Email"
                id="formEmailInput"
                val={email}
                setState={setEmail}
                err={emailErr}
            />
            <Input
                title="Password"
                id="formPasswordInput"
                val={password}
                setState={setPassword}
                err={passwordErr}
            />
            <Input
                title="Display Name"
                id="formDisplayNameInput"
                val={displayName}
                setState={setDisplayName}
                err={displayNameErr}
            />
            {registrationErr && (
                <div className="form_error" style={{ color: "red", marginTop: "8px", marginBottom: "18px" }}>
                    {registrationErr}
                </div>
            )}
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={registerUser}>
                    Register
                </button>
                <div className="mandatory_indicator">* indicates mandatory fields</div>
            </div>
        </Form>
    );
};

export default UserRegistration;
