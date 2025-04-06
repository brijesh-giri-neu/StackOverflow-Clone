import express from 'express';
import { Request, Response } from 'express';
import User from '../models/users';
import { IUser } from '../types/types';

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
    req.session.userId = newUser._id;
    res.status(200).json(newUser);
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
    try {
        const { email, password } = req.body;
        const user = await User.loginUser(email, password);
        if (user) {
            req.session.userId = user._id;
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login" });
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
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Error logging out" });
        }
        // Optionally clear the session cookie, 'connect.sid' is the default session cookie name.
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logout successful" });
    });
});

/**
 * @route   GET /user/session
 * @desc    Get the currently authenticated user based on session.
 * @access  Public (or Protected, depending on your use case)
 */
router.get('/session', async (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        const user = await User.getUserById(req.session.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
