import bcrypt from "bcrypt";
import { EncryptJWT, jwtDecrypt, importJWK, base64url } from "jose";
import crypto from "crypto";


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
export async function hashPassword(password: string): Promise<string> {
    try {
        const SALT_ROUNDS = 10;
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        return bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

/**
 * JWT secret key for encrypting and decrypting tokens.
 * In production, this should be stored in environment variables.
 * The secret must be at least 32 characters for AES-256 encryption.
 */
const JWT_SECRET = process.env.JWT_SECRET || "your_very_secret_jwt_encryption_key_min_32_chars_for_aes256";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Creates a secret key for JWE encryption from the JWT secret string.
 * Derives a 256-bit key using SHA-256 hash for AES-256-GCM encryption.
 */
const getSecretKey = async () => {
  // Derive a consistent 256-bit key from the secret using SHA-256
  const hash = crypto.createHash('sha256').update(JWT_SECRET).digest();
  
  // Convert to JWK format for jose library
  const jwk = {
    kty: 'oct',
    k: base64url.encode(hash),
    alg: 'dir',
    enc: 'A256GCM'
  };
  
  return await importJWK(jwk, 'dir');
};

/**
 * Interface for JWT payload containing user information.
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Generates an encrypted JWT token (JWE) for a user.
 * The token payload is encrypted using AES-256-GCM, making it unreadable without the secret key.
 * 
 * @param userId - The user's MongoDB ObjectId as a string.
 * @param email - The user's email address.
 * @returns An encrypted JWT token string (JWE format).
 */
export const generateToken = async (userId: string, email: string): Promise<string> => {
  const payload = {
    userId,
    email,
  };

  const secretKey = await getSecretKey();
  
  // Encrypt the JWT payload using JWE (JSON Web Encryption)
  // This makes the token content unreadable without the decryption key
  const encryptedToken = await new EncryptJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .encrypt(secretKey);

  return encryptedToken;
};

/**
 * Verifies and decrypts an encrypted JWT token (JWE).
 * 
 * @param token - The encrypted JWT token string to decrypt and verify.
 * @returns The decrypted JWT payload if valid, or null if invalid/expired.
 */
export const verifyToken = async (token: string): Promise<JWTPayload | null> => {
  try {
    const secretKey = await getSecretKey();
    
    // Decrypt the JWE token
    const { payload } = await jwtDecrypt(token, secretKey);
    
    // Cast the decrypted payload to our JWTPayload type
    const decryptedPayload = payload as unknown as JWTPayload;
    
    // Validate that required fields exist
    if (decryptedPayload.userId && decryptedPayload.email) {
      return decryptedPayload;
    }
    
    return null;
  } catch {
    // Token is invalid, expired, malformed, or decryption failed
    return null;
  }
};

/**
 * Extracts JWT token from Authorization header (Bearer token only).
 * Tokens are NOT extracted from cookies - only from Authorization header.
 * 
 * @param authHeader - The Authorization header value (e.g., "Bearer <token>").
 * @returns The extracted token string, or null if not found.
 */
export const extractToken = (authHeader?: string): string | null => {
  // Extract token from Authorization header (Bearer token)
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
};

