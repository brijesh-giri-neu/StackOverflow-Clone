import { useState } from "react";
import { VoidFunctionType, UserObjFunctionType, UserProfileObjFunctionType } from "../types/functionTypes";
import { loginExistingUser } from "../services/userService";
import { getUserProfile } from "../services/userProfileService";
import { UserResponseType } from "../types/entityTypes";

/**
 * A custom hook for handling user login logic, including validation and error handling.
 *
 * @param setUser - Function to update the global user state with the logged-in user's details.
 * @param setUserProfile - Function to update the global user profile state with the logged-in user's info.
 * @param handleQuestions - Function to navigate to the questions page after login.
 * @returns An object containing login form state, error messages, and the loginUser function.
 */
export const useUserLogin = (
    setUser: UserObjFunctionType,
    setUserProfile: UserProfileObjFunctionType,
    handleQuestions: VoidFunctionType
) => {
    const [email, _setEmail] = useState<string>("");
    const [password, _setPassword] = useState<string>("");

    const [emailErr, setEmailErr] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");
    const [loginErr, setLoginErr] = useState<string>("");

    const setEmail = (value: string) => {
        _setEmail(value);
        if (emailErr) setEmailErr("");
        if (loginErr) setLoginErr("");
    };

    const setPassword = (value: string) => {
        _setPassword(value);
        if (passwordErr) setPasswordErr("");
        if (loginErr) setLoginErr("");
    };

    const loginUser = async () => {
        setEmailErr("");
        setPasswordErr("");
        setLoginErr("");

        let isValid = true;

        if (!email){
            setEmailErr("Please enter email address");
            isValid = false;
        }
        
        if (!password){
            setPasswordErr("Please enter password");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const user: UserResponseType = await loginExistingUser(email, password);
            if (user) {
                // Update global user state
                setUser(user);
                // Update user profile state with the logged-in user's object in its "user" field.
                const fetchedProfile = await getUserProfile(user._id);
                if(fetchedProfile){
                    setUserProfile({
                        user: {
                            _id: user._id,
                            email: user.email,
                            displayName: user.displayName,
                            password: user.password,
                        },
                        fullName: fetchedProfile.fullName ? fetchedProfile.fullName : "",
                        location: fetchedProfile.location ? fetchedProfile.location : "",
                        title: fetchedProfile.title ? fetchedProfile.title : "",
                        aboutMe: fetchedProfile.aboutMe ? fetchedProfile.aboutMe : "",
                        website: fetchedProfile.website ? fetchedProfile.website : "",
                        twitter: fetchedProfile.twitter ? fetchedProfile.twitter : "",
                        github: fetchedProfile.github ? fetchedProfile.github : "",
                    });
                }
                else{
                    setUserProfile({
                        user: {
                            _id: user._id,
                            email: user.email,
                            displayName: user.displayName,
                            password: user.password,
                        },
                        fullName: "",
                        location: "",
                        title: "",
                        aboutMe: "",
                        website: "",
                        twitter: "",
                        github: "",
                    });
                }
                handleQuestions();
            } else {
                setLoginErr("Invalid email or password.");
            }
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setLoginErr("Invalid email or password.");
            } else {
                setLoginErr("An error occurred. Please try again later.");
            }
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        emailErr,
        passwordErr,
        loginErr,
        loginUser,
    };
};
