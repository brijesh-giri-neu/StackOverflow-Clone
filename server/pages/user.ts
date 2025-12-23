import express from 'express';
import { Request, Response } from 'express';
import User from '../models/users';
import { IUser } from '../types/types';
import { isAuthenticated } from '../middlewares/auth/isAuthenticated';
import { isAuthorized } from '../middlewares/auth/isAuthorized';
import { generateToken } from '../services/authService';

const router = express.Router();

/**
 * @route   POST /user/register
 * @desc    Register a new user with email, displayName, and password.
 * @access  Public
 * @param {Request} req - The request object, containing the body with `email`, `displayName`, and `password` fields.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Response} - A JSON response containing the newly created user.
 */
router.post('/register', async (req: Request, res: Response) => {
    const { email, displayName, password } = req.body;
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }
    const user: IUser = { email, displayName, password };
    const newUser = await User.registerUser(user);
    
    // Generate encrypted JWT token.
    if (!newUser._id || !newUser.email) {
        return res.status(500).json({ message: "Error creating user" });
    }
    const token = await generateToken(newUser._id, newUser.email);
    
    // Set session for backward compatibility.
    req.session.userId = newUser._id;
    
    // Return encrypted token in response body.
    res.status(200).json({ 
        message: "Registration successful", 
        user: newUser,
        token
    });
});

/**
 * @route   POST /user/login
 * @desc    Log in a user using email and password.
 * @access  Public
 * @param {Request} req - The request object, containing the body with `email` and `password` fields.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Response} - A JSON response indicating whether the login was successful.
 */
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.loginUser(email, password);
    if (user && user._id && user.email) {
        // Generate encrypted JWT token.
        const token = await generateToken(user._id, user.email);
        
        // Set session for backward compatibility
        req.session.userId = user._id;
        
        // Return encrypted token in response body.
        res.status(200).json({ 
            message: "Login successful", 
            user,
            token
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

/**
 * @route   POST /user/logout
 * @desc    Log out the currently authenticated user.
 *          This endpoint destroys the user's session and clears the session cookie.
 * @access  Public (or Protected, depending on your needs)
 * @param {Request} req - The request object, which contains the session.
 * @param {Response} res - The response object used to send the result back to the client.
 * @returns {Response} - A JSON response indicating logout success or an error.
 */
router.post("/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
    });
});

/**
 * @route   GET /user/session
 * @desc    Get the currently authenticated user.
 *          This endpoint authenticates via:
 *          - Encrypted JWT token in Authorization header (Bearer token) - primary method
 *          - Session cookie (for backward compatibility only)
 * @access  Protected (requires authentication)
 */
router.get('/session', isAuthenticated, async (req: Request, res: Response) => {
    // req.userId is set by isAuthenticated middleware based on the authentication method.
    const userId = req.userId;
    
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    
    // Generate a new encrypted JWT token for the session (useful after page refresh).
    // This allows the frontend to restore the Bearer token in memory.
    if (!user._id || !user.email) {
        return res.status(500).json({ message: "Error retrieving user data" });
    }
    const token = await generateToken(user._id, user.email);
    
    res.status(200).json({ 
        user,
        token // Return token so frontend can restore it in memory.
    });
});

/**
 * @route   DELETE /user/delete
 * @desc    Permanently deletes the currently authenticated user account.
 *          This performs a hard delete by removing the user from the database,
 *          nullifying references in related collections (e.g., questions, answers, comments),
 *          and deleting votes made by the user.
 *          The user session is destroyed and the session cookie is cleared after deletion.
 * @access  Protected (Requires authentication and authorization)
 * @param {Request} req - The Express request object containing the session with the user ID.
 * @param {Response} res - The Express response object used to send the deletion result.
 * @returns {Response} - A JSON response indicating that the account was permanently deleted.
 */
router.delete("/delete", isAuthenticated, isAuthorized, async (req: Request, res: Response) => {
    // req.userId is set by isAuthenticated middleware based on the authentication method.
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    await User.deleteUserById(userId);

    // Logout user
    req.session.destroy(() => {
        // Clear session cookie.
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Account deleted successfully" });
    });
});

export default router;
