import { REACT_APP_API_URL, api } from "./config";
import { UserResponseType } from "../types/entityTypes";

// The base URL for the user API
const USER_API_URL = `${REACT_APP_API_URL}/user`;

/**
 * The function calls the API to register a new user with email, displayName, and password.
 * It returns the response data if the status is 200; otherwise, it throws an error.
 * 
 * @param user - An object containing the user's email, displayName, and password.
 * @returns A promise that resolves to the newly created user object.
 */
const registerNewUser = async (
    user: { email: string; displayName: string; password: string }
): Promise<UserResponseType> => {
    try {
        const res = await api.post(`${USER_API_URL}/register`, user);
        if (res.status !== 200) {
            throw new Error("Error while registering user");
        }
        return res.data;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

/**
 * The function calls the API to log in a user by verifying their email and password.
 * It returns a boolean indicating whether the login was successful.
 * 
 * @param email - The email of the user trying to log in.
 * @param password - The plain text password of the user.
 * @returns A promise that resolves to true if the credentials are correct, or false otherwise.
 */
const loginExistingUser = async (email: string, password: string): Promise<UserResponseType> => {
    try {
        const res = await api.post(`${USER_API_URL}/login`, { email, password });
        if (res.status !== 200) {
            throw new Error("Error while logging in");
        }
        if (res.data.user) {
            return res.data.user;
        }
        throw new Error("Login failed: Invalid credentials");
    } catch (error) {
        console.error("Error logging in user:", error);
        throw error;
    }
};

export { registerNewUser, loginExistingUser };
