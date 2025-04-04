import mongoose from "mongoose";
import UserSchema from "./schema/user";
import { IUser, IUserDocument, IUserModel } from "../types/types";

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
 * Static Method: loginUser
 * Logs in a user by checking if the provided email and password match a user document.
 * 
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<Boolean>} - Returns true if credentials match; otherwise, false.
 */
UserSchema.statics.loginUser = async function (email: string, password: string): Promise<Boolean> {
    const foundUser = await this.findOne({ email }).exec();
    // NOTE: In production, use a proper hashing and secure password comparison.
    if (!foundUser || foundUser.password !== password) {
        return false;
    }
    return true;
};

/**
 * The User model representing the Users collection in MongoDB.
 * 
 * @type {mongoose.Model<IUserDocument, IUserModel>}
 */
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
