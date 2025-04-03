import { useUserRegistration } from "../../../hooks/useUserRegistration";
import Input from "../baseComponents/input/inputView"; // Reuse input component
import Form from "../baseComponents/form/formView"; // Reuse form component
import { VoidFunctionType } from "../../../types/functionTypes";

interface UserRegistrationProps {
    handleQuestions: VoidFunctionType;
}

const UserRegistration = ({ handleQuestions }: UserRegistrationProps) => {
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
    } = useUserRegistration(handleQuestions);

    return (
        <Form>
            <Input
                title="Email"
                hint="Enter your email"
                id="formEmailInput"
                val={email}
                setState={setEmail}
                err={emailErr}
            />
            <Input
                title="Password"
                hint="Enter your password"
                id="formPasswordInput"
                val={password}
                setState={setPassword}
                err={passwordErr}
            />
            <Input
                title="Display Name"
                hint="Enter a display name"
                id="formDisplayNameInput"
                val={displayName}
                setState={setDisplayName}
                err={displayNameErr}
            />
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
