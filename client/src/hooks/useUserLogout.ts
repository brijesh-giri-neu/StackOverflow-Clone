import { VoidFunctionType } from "../types/functionTypes";
import { toast } from 'react-toastify';
import { logoutCurrentUser } from "../services/userService";

/**
 * A custom hook for handling user logout logic.
 * It returns a function that invokes the provided handleUserLogout callback.
 *
 * @param handleUserLogout - Function to be called when logging out (e.g., to clear user state).
 * @returns An object containing the logoutUser function.
 */
export const useUserLogout = (handleUserLogout: VoidFunctionType) => {
    const logoutUser = async () => {
        await logoutCurrentUser();
        handleUserLogout();
        toast.success("Logged out successfully.", {
            position: "top-center",      
            autoClose: 1000,             
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
        });
    };

    return { logoutUser };
};
