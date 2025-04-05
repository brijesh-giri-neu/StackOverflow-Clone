import { useState } from "react";
import { VoidFunctionType, UserObjFunctionType, UserProfileObjFunctionType } from "../types/functionTypes";
import { loginExistingUser } from "../services/userService";
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
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailErr, setEmailErr] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");
    const [loginErr, setLoginErr] = useState<string>("");

    const loginUser = async () => {
        // Clear previous error messages
        setEmailErr("");
        setPasswordErr("");
        setLoginErr("");

        let isValid = true;

        // Validate email
        if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            setEmailErr("Please enter a valid email address");
            isValid = false;
        }

        // Validate password (e.g., minimum 8 characters)
        if (!password || password.length < 8) {
            setPasswordErr("Password must be at least 8 characters");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            // Call API to log in; expects to return a user object if successful
            const user: UserResponseType = await loginExistingUser(email, password);
            if (user) {
                // Update global user state
                setUser(user);
                // Update user profile state with the logged-in user's object in its "user" field.
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
                handleQuestions();
            } else {
                setLoginErr("Incorrect email or password.");
            }
        } catch (err: any) {
            if (err.response && err.response.status === 401) {
                setLoginErr("Incorrect email or password.");
            } else {
                setLoginErr("An error occurred. Please try again later.");
            }
            console.error("Login error:", err);
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
