/**
 * This file contains the configuration for the axios instance that will be used to make requests to the API.
 * 
 * The configuration includes the base URL for the API and the interceptors that will be used to handle the requests and responses.
 */

import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getAuthToken, removeAuthToken } from "../utils/authToken";

// Base URL for the REST API of the server.
const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/**
 * The handler function handles the response from the server by simply returning the response.
 * @param res an AxiosResponse object
 * @returns an AxiosResponse object
 */
const handleRes = (res: AxiosResponse): AxiosResponse => {
  return res;
};

/**
 * The handler function handles the error by logging it to the console and returning a rejected promise with the error object.
 * @param err an AxiosError object
 * @returns a rejected promise with the error object
 */
const handleErr = (err: AxiosError): Promise<never> => {
  console.error(err);
  return Promise.reject(err);
};

/**
 * The axios instance that will be used to make requests to the API.
 * 
 * withCredentials is set to true to allow session cookies for backward compatibility.
 * This enables the initial session check on page refresh to work via session cookies.
 * Once authenticated, JWT tokens (encrypted JWE) are stored in memory and sent as Bearer tokens.
 * JWT tokens are NOT stored in cookies - only session cookies are used for initial auth check.
 */
const api = axios.create({ withCredentials: true });

/**
 * Request interceptor that automatically adds the encrypted JWT token (JWE) 
 * to all outgoing API requests as a Bearer token in the Authorization header.
 * 
 * This ensures all authenticated requests include the token, regardless of
 * which service method is called (GET, POST, PUT, DELETE, etc.).
 * 
 * The token is retrieved from in-memory storage and added only if it exists.
 * If no token exists, the request proceeds without the Authorization header
 * (useful for public endpoints like login/register).
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Get encrypted JWT token from in-memory storage
    const token = getAuthToken();
    
    // Add Bearer token to Authorization header if token exists
    // This applies to ALL requests: GET, POST, PUT, DELETE, PATCH, etc.
    // Axios config.headers is always defined, so we can safely set it
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<never> => handleErr(error)
);

/**
 * Response interceptor that handles authentication errors.
 * 
 * Automatically clears the stored token when a 401 Unauthorized response is received,
 * which typically indicates the token has expired, is invalid, or the user is not authenticated.
 * This prevents the app from making further requests with an invalid token.
 */
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => handleRes(response),
  (error: AxiosError): Promise<never> => {
    // If we get a 401 Unauthorized, the token is likely invalid/expired
    // Clear the token from memory to prevent further failed requests
    if (error.response?.status === 401) {
      removeAuthToken();
    }
    return handleErr(error);
  }
);

export { REACT_APP_API_URL, api };
