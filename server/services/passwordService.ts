import bcrypt from "bcrypt";

/**
 * Asynchronously hashes a plain text password using bcrypt.
 *
 * @param {string} password - The plain text password to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed password.
 *
 * @example
 * const hashed = await hashPassword("mySecurePassword123");
 * console.log(hashed); // "$2b$10$..."
 */
export async function hashPassword(password: string) : Promise<string> {
    try {
        const SALT_ROUNDS = 10;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
        throw error;
    }
}