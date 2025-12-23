import mongoose from "mongoose";
import { IUserDocument, IUserModel } from "../../types/types";
import { hashPassword } from "../../services/authService";

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
        email: { type: String, required: true, unique: true, match: [/\S+@\S+\.\S+/, "Please enter a valid email address"] },
        displayName: { type: String, required: true, match: [/^[a-zA-Z0-9_ ]+$/, "Display name contains invalid characters"] },
        password: { type: String, required: true, minlength: [8, "Password must be at least 8 characters long"] },
        isDeleted: { type: Boolean, default: false},
    },
    { collection: "User" }
);

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
// NOTE: THIS BLOCK WILL NOT BE COVERED BY UNIT TESTS because execution of PRE-SAVE hook requires connecting to actual MongoDB database.
UserSchema.pre<IUserDocument>("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await hashPassword(this.password);
    next();
});

export default UserSchema;
