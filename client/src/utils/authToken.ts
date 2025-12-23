/**
 * Utility functions for managing JWT authentication tokens in memory.
 * Token is stored in a module-level variable.
 */

// In-memory token storage (lost on page refresh)
let authToken: string | null = null;

/**
 * Stores the JWT token in memory.
 * @param token - The JWT token string to store.
 */
export const setAuthToken = (token: string): void => {
  authToken = token;
};

/**
 * Retrieves the JWT token from memory.
 * @returns The JWT token string, or null if not found.
 */
export const getAuthToken = (): string | null => {
  return authToken;
};

/**
 * Removes the JWT token from memory.
 */
export const removeAuthToken = (): void => {
  authToken = null;
};

/**
 * Checks if a JWT token exists in memory.
 * @returns True if a token exists, false otherwise.
 */
export const hasAuthToken = (): boolean => {
  return authToken !== null;
};

