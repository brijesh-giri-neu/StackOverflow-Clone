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
            res.status(200).json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
});

export default router;
