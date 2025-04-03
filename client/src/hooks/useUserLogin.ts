import { useState } from "react";
import { VoidFunctionType } from "../types/functionTypes";

/**
 * A custom hook for handling user login logic, including validation.
 * @returns login logic including form state and error handling.
 */
export const useUserLogin = (handleQuestions: VoidFunctionType) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [emailErr, setEmailErr] = useState<string>("");
    const [passwordErr, setPasswordErr] = useState<string>("");

    const loginUser = async () => {
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

        if (!isValid) {
            return;
        }

        // Proceed with login logic, e.g., API call to authenticate the user
        const user = {
            email: email,
            password: password
        };

        if (isValid) {
            console.log(user);
            handleQuestions();
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        emailErr,
        passwordErr,
        loginUser,
    };
};