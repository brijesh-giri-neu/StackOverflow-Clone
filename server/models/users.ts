import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUser, IUserDocument, IUserModel } from "../types/types";
import bcrypt from "bcrypt";
import { convertToIUser } from "../utilities/formatUtils";

/**
 * Static Method: registerUser
 * Registers a new user with email, displayName, and password.
 * 
 * @param {IUser} user - The user details.
 * @returns {Promise<IUser>} - The newly created user object.
 */
UserSchema.statics.registerUser = async function (user: IUser): Promise<IUser> {
    const newUser: IUserDocument = await this.create(user);
    return convertToIUser(newUser);
};

/**
 * Static Method: loginUser
 * Logs in a user by verifying that the provided plain text password matches the stored hashed password.
 *
 * @param {string} email - The email address of the user trying to log in.
 * @param {string} plainPassword - The plain text password provided by the user.
 * @returns {Promise<IUser | null>} A promise that resolves to the user object if the credentials are correct, or null otherwise.
 */
UserSchema.statics.loginUser = async function (
    email: string,
    plainPassword: string
): Promise<IUser | null> {
    const user = await this.findOne({ email }).exec();
    if (!user) return null;

    // Compare the plain text password with the stored hashed password.
    const passwordMatches = await bcrypt.compare(plainPassword, user.password);
    if (!passwordMatches) return null;
    
    return convertToIUser(user);
};

/**
 * Static Method: getUserById
 * Fetches a user by their MongoDB ObjectId.
 * 
 * @param {string} userId - The user's ObjectId as a string.
 * @returns {Promise<IUser | null>} - The user object in IUser format, or null if not found.
 */
UserSchema.statics.getUserById = async function (userId: string): Promise<IUser | null> {
    const user = await this.findById(userId).exec();
    return user ? convertToIUser(user) : null;
};

/**
 * The User model representing the Users collection in MongoDB.
 * 
 * @type {mongoose.Model<IUserDocument, IUserModel>}
 */
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
