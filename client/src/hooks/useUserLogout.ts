import { VoidFunctionType } from "../types/functionTypes";

/**
 * A custom hook for handling user logout logic.
 * It returns a function that invokes the provided handleUserLogout callback.
 *
 * @param handleUserLogout - Function to be called when logging out (e.g., to clear user state).
 * @returns An object containing the logoutUser function.
 */
export const useUserLogout = (handleUserLogout: VoidFunctionType) => {
    const logoutUser = async () => {
        // Optionally, you could also call an API endpoint for logging out on the server side here.
        // For now, simply call the passed-in function.
        handleUserLogout();
    };

    return { logoutUser };
};
