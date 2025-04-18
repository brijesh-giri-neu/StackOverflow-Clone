import { VoidFunctionType } from "../types/functionTypes";
import { toast } from 'react-toastify';
import { deleteCurrentUser, logoutCurrentUser } from "../services/userService";

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
        toast.success("Logged out successfully");
    };

    return { logoutUser };
};

/**
 * A custom hook for deleting the currently authenticated user account.
 * It invokes the provided `handleUserLogout` function to clear state and redirect after deletion.
 *
 * @param handleUserLogout - Function to call after successful deletion (e.g., clearing user session state).
 * @returns An object with a `deleteUser` function that performs the delete operation.
 */
export const useUserDelete = (handleUserLogout: VoidFunctionType) => {
    const deleteUser = async () => {
        try {
            await deleteCurrentUser();
            handleUserLogout();
            toast.success("Account deleted successfully");
        } catch (error) {
            toast.error("Failed to delete account");
            console.error("Account deletion error:", error);
        }
    };

    return { deleteUser };
};