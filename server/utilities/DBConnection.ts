import mongoose from "mongoose";

/**
 * Singleton class to manage MongoDB connection.
 * Ensures that only one instance of the connection exists across the application.
 */
class DBConnection {
    /** Holds the singleton instance of the DBConnection class. */
    private static instance: DBConnection;

    /** MongoDB connection URL. Update as per your database configuration. */
    private static MONGO_URL: string = "mongodb://127.0.0.1:27017/fake_so";

    /**
     * Private constructor to prevent direct instantiation.
     * Initializes the database connection upon instance creation.
     */
    private constructor() {
        this.connect();
    }

    /**
     * Retrieves the singleton instance of the database connection.
     * If an instance does not exist, it creates a new one.
     *
     * @returns {DBConnection} The singleton instance of DBConnection.
     */
    public static getInstance(): DBConnection {
        if (!DBConnection.instance) {
            DBConnection.instance = new DBConnection();
        }
        return DBConnection.instance;
    }

    /**
     * Establishes the connection to MongoDB using Mongoose.
     * Logs a success message on successful connection or exits the process on failure.
     *
     * @returns {Promise<void>} A promise that resolves when the connection is established.
     */
    private async connect(): Promise<void> {
        try {
            await mongoose.connect(DBConnection.MONGO_URL);
            console.log("Connected to MongoDB");
        } catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1); // Exit if the database connection fails
        }
    }

    /**
     * Closes the existing MongoDB connection.
     * Logs a success message upon successful disconnection or an error message if it fails.
     *
     * @returns {Promise<void>} A promise that resolves when the connection is closed.
     */
    public async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("Database disconnected");
        } catch (error) {
            console.error("Error disconnecting from MongoDB:", error);
        }
    }
}

export default DBConnection;
