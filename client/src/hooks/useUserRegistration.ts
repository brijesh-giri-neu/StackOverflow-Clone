import { useState } from "react";
import { VoidFunctionType } from "../types/functionTypes";
import { registerNewUser } from "../services/userService";

/**
 * A custom hook for handling user registration logic, including validation.
 * @returns registration logic including form state and error handling.
 */
export const useUserRegistration = (handleQuestions: VoidFunctionType) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [displayName, setDisplayName] = useState<string>("");

    const [emailErr, setEmailErr] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");
    const [displayNameErr, setDisplayNameErr] = useState<string>("");

    const registerUser = async () => {
        let isValid = true;

        // Email validation
        if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
            setEmailErr("Please enter a valid email address");
            isValid = false;
        }

        // Password validation (example: minimum 8 characters)
        if (!password || password.length < 8) {
            setPasswordErr("Password must be at least 8 characters");
            isValid = false;
        }

        // Display name validation
        if (!displayName) {
            setDisplayNameErr("Display name is required");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Proceed with registration logic, e.g., API call to register the user
        const res = await registerNewUser({email, password, displayName}); // replace with your API logic

        if (res && res._id) {
            handleQuestions();
        }

        const user = {
            email: email,
            password: password,
            display_name: displayName
        };

        // if(isValid){
        //     console.log(user);
        //     handleQuestions();
        // }
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
    };
};
