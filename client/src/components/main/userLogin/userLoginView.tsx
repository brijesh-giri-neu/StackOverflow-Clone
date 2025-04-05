import { useUserLogin } from "../../../hooks/useUserLogin";
import Input from "../baseComponents/input/inputView";
import Form from "../baseComponents/form/formView";
import { UserObjFunctionType, UserProfileObjFunctionType, VoidFunctionType } from "../../../types/functionTypes";

interface UserLoginProps {
    setUser: UserObjFunctionType;
    setUserProfile: UserProfileObjFunctionType;
    handleQuestions: VoidFunctionType;
}

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
            />
            {loginErr && (
                <div className="form_error" style={{ color: "red", marginTop: "8px", marginBottom: "18px" }}>
                    {loginErr}
                </div>
            )}
            <div className="btn_indicator_container">
                <button className="form_postBtn" onClick={loginUser}>
                    Login
                </button>
                <div className="mandatory_indicator">* indicates mandatory fields</div>
            </div>
        </Form>
    );
};

export default UserLogin;
