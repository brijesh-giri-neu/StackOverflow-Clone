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
    try {
        const { email, displayName, password } = req.body;
        const user: IUser = { email, displayName, password };
        const newUser = await User.registerUser(user);
        res.status(200).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error });
    }
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
        const isAuthenticated = await User.loginUser(email, password);
        if (isAuthenticated) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Login failed", error });
    }
});

export default router;
