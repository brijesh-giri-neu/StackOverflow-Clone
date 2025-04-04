import mongoose from "mongoose";
import { IUserDocument, IUserModel } from "../../types/types";
import bcrypt from "bcrypt";

/**
 * The schema for a document in the User collection.
 * 
 * @type {mongoose.Schema<IUserDocument, IUserModel>}
 * @property {string} email - The user's email (Required, unique).
 * @property {string} displayName - The user's display name (Required).
 * @property {string} password - The user's password (Required).
 */
const UserSchema = new mongoose.Schema<IUserDocument, IUserModel>(
    {
        email: { type: String, required: true, unique: true },
        displayName: { type: String, required: true },
        password: { type: String, required: true },
    },
    { collection: "User" }
);

/**
 * Static Method: Get a user by email.
 * 
 * @param {string} email - The email to search for.
 * @returns {Promise<IUserDocument | null>} - A promise that resolves to the user document or null if not found.
 */
UserSchema.statics.getUserByEmail = async function (
    email: string
): Promise<IUserDocument | null> {
    return this.findOne({ email }).exec();
};

/**
 * Static Method: loginUser
 * Logs in a user by verifying that the provided plain text password matches the stored hashed password.
 *
 * @param {string} email - The email address of the user trying to log in.
 * @param {string} plainPassword - The plain text password provided by the user.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches, or false otherwise.
 */
UserSchema.statics.loginUser = async function (
    email: string,
    plainPassword: string
): Promise<boolean> {
    const user = await this.findOne({ email }).exec();
    if (!user) return false;

    // Compare the plain text password with the stored hashed password.
    const passwordMatches = await bcrypt.compare(plainPassword, user.password);
    return passwordMatches;
};

/**
 * Pre-save hook for the User schema.
 * Hashes the user's password using bcrypt before saving the user document to the database.
 *
 * This hook checks if the password field has been modified. If it hasn't been modified,
 * it calls next() immediately to continue. If it has been modified, it generates a salt,
 * hashes the password, and replaces the plain text password with the hashed version.
 *
 * @param {Function} next - The callback function to signal completion of the middleware.
 */
UserSchema.pre<IUserDocument>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const SALT_ROUNDS = 10;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        const hash = await bcrypt.hash(this.password, salt);
        this.password = hash;
        next();
    } catch (error) {
        console.log(error);
    }
});


export default UserSchema;
