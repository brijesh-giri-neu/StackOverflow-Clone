import { useUserLogin } from "../../../hooks/useUserLogin";
import Input from "../baseComponents/input/inputView";
import Form from "../baseComponents/form/formView";
import { UserObjFunctionType, UserProfileObjFunctionType, VoidFunctionType } from "../../../types/functionTypes";

interface UserLoginProps {
    /** Function to set the user object after successful login */
    setUser: UserObjFunctionType;
    /** Function to set the user profile object after successful login */
    setUserProfile: UserProfileObjFunctionType;
    /** Function to fetch and display all questions after login */
    handleQuestions: VoidFunctionType;
}

/**
 * A user login form component.
 * Allows users to enter email and password to log in.
 *
 * @param setUser - Sets the logged-in user state
 * @param setUserProfile - Sets the user profile state
 * @param handleQuestions - Fetches default questions after login
 */
const UserLogin = ({ setUser, setUserProfile, handleQuestions }: UserLoginProps) => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        emailErr,
        passwordErr,
        loginErr,
        loginUser,
    } = useUserLogin(setUser, setUserProfile, handleQuestions);

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
                type="password"
            />
            {loginErr && (
                <div className="text-danger mb-3 mt-2">
                    {loginErr}
                </div>
            )}
            <div className="btn_indicator_container">
                <button className="btn btn-primary form_postBtn" onClick={loginUser}>
                    Login
                </button>
                <div className="mandatory_indicator">* indicates mandatory fields</div>
            </div>
        </Form>
    );
};

export default UserLogin;
