import { useUserLogin } from "../../../hooks/useUserLogin";
import Input from "../baseComponents/input/inputView"; 
import Form from "../baseComponents/form/formView";
import { VoidFunctionType } from "../../../types/functionTypes";

interface UserLoginProps {
    handleQuestions: VoidFunctionType;
}

const UserLogin = ({ handleQuestions }: UserLoginProps) => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        emailErr,
        passwordErr,
        loginUser,
    } = useUserLogin(handleQuestions);

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
