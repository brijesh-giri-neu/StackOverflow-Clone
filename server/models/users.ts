import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUser, IUserDocument, IUserModel } from "../types/types";
import bcrypt from "bcrypt";

/**
 * Static Method: registerUser
 * Registers a new user with email, displayName, and password.
 * 
 * @param {IUser} user - The user details.
 * @returns {Promise<IUser>} - The newly created user object.
 */
UserSchema.statics.registerUser = async function (user: IUser): Promise<IUser> {
    const newUser: IUserDocument = await this.create(user);
    const userObj = newUser.toObject();

    // Build a new object conforming to IUser
    return {
        _id: userObj._id.toString(),
        email: userObj.email,
        displayName: userObj.displayName,
        password: userObj.password,
    };
};

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
 * The User model representing the Users collection in MongoDB.
 * 
 * @type {mongoose.Model<IUserDocument, IUserModel>}
 */
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
