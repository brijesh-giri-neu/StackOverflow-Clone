import { useState } from "react";
import { UserObjFunctionType, UserProfileObjFunctionType, VoidFunctionType } from "../types/functionTypes";
import { registerNewUser } from "../services/userService";
import { toast } from "react-toastify";

/**
 * A custom hook for managing user registration logic and form validation.
 * 
 * @param {VoidFunctionType} handleQuestions - A callback to be triggered after successful registration (e.g., to show questions).
 * @param {UserObjFunctionType} setUser - Function to update the global user state.
 * @param {UserProfileObjFunctionType} setUserProfile - Function to update the user's profile state.
 * 
 * @returns {Object} The form state, error messages, and a `registerUser` function to trigger registration.
 * @property {string} email - Current email input value.
 * @property {Function} setEmail - Setter for email value with validation error clearing.
 * @property {string} password - Current password input value.
 * @property {Function} setPassword - Setter for password value with validation error clearing.
 * @property {string} displayName - Current display name input value.
 * @property {Function} setDisplayName - Setter for display name with validation error clearing.
 * @property {string} emailErr - Error message for the email field.
 * @property {string} passwordErr - Error message for the password field.
 * @property {string} displayNameErr - Error message for the display name field.
 * @property {string} registrationErr - General error message related to registration.
 * @property {Function} registerUser - Function to validate form input and send a registration request.
 */
export const useUserRegistration = (
    handleQuestions: VoidFunctionType,
    setUser: UserObjFunctionType,
    setUserProfile: UserProfileObjFunctionType
) => {
    const [email, _setEmail] = useState<string>("");
    const [password, _setPassword] = useState<string>("");
    const [displayName, _setDisplayName] = useState<string>("");

    const [emailErr, setEmailErr] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");
    const [displayNameErr, setDisplayNameErr] = useState<string>("");
    const [registrationErr, setRegistrationErr] = useState<string>("");

    const setEmail = (value: string) => {
        _setEmail(value);
        if (emailErr) setEmailErr("");
        if (registrationErr) setRegistrationErr("");
    };

    const setPassword = (value: string) => {
        _setPassword(value);
        if (passwordErr) setPasswordErr("");
        if (registrationErr) setRegistrationErr("");
    };

    const setDisplayName = (value: string) => {
        _setDisplayName(value);
        if (displayNameErr) setDisplayNameErr("");
        if (registrationErr) setRegistrationErr("");
    };

    const registerUser = async () => {
        let isValid = true;

        if (!email) {
            setEmailErr("Email address is required");
            isValid = false;
        }

        if (!password) {
            setPasswordErr("Password is required");
            isValid = false;
        }

        if (email && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            setEmailErr("Please enter a valid email address");
            isValid = false;
        }

        if (password && password.length < 8) {
            setPasswordErr("Password must be at least 8 characters");
            isValid = false;
        }

        if (!displayName) {
            setDisplayNameErr("Display name is required");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        try {
            const user = await registerNewUser({ email, password, displayName });
            if (user && user._id) {
                if (user) {
                    setUser(user);

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
                    toast.success("User registered successfully");
                    handleQuestions();
                }
                handleQuestions();
            }
            else {
                setRegistrationErr("User registration failed");
            }
        }
        catch (err: any) {
            if (err.response && err.response.status === 400) {
                setRegistrationErr("Email already in use");
            } else {
                setRegistrationErr("An error occurred. Please try again later.");
            }
        }
    };

    return {
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
        registrationErr,
    };
};
