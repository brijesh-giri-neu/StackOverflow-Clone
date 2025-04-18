import mongoose from "mongoose";
import DBConnection from "../../utilities/DBConnection";

// Mock mongoose methods
jest.mock("mongoose", () => ({
    connect: jest.fn(),
    disconnect: jest.fn()
}));

describe("DBConnection Singleton", () => {
    beforeEach(() => {
        // Reset Mocks
        jest.clearAllMocks();
        // Clear the singleton instance so each test is isolated
        (DBConnection as any).instance = undefined;
    });

    it("should establish a connection on first getInstance call", async () => {
        (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);

        const instance = DBConnection.getInstance();

        // Wait for the async connection to resolve
        await new Promise(setImmediate);

        expect(instance).toBeInstanceOf(DBConnection);
        expect(mongoose.connect).toHaveBeenCalledTimes(1);
    });

    it("should return the same instance on multiple getInstance calls", async () => {
        const firstInstance = DBConnection.getInstance();
        const secondInstance = DBConnection.getInstance();

        expect(secondInstance).toBe(firstInstance);
        expect(mongoose.connect).toHaveBeenCalledTimes(1); // should still be one connection attempt
    });


    it("should disconnect from database successfully", async () => {
        const instance = DBConnection.getInstance();
        await instance.disconnect();

        expect(mongoose.disconnect).toHaveBeenCalledTimes(1);
    });

    it("should log error if disconnect fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        (mongoose.disconnect as jest.Mock).mockRejectedValueOnce(new Error("disconnect error"));

        const instance = DBConnection.getInstance();
        await instance.disconnect();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "Error disconnecting from MongoDB:",
            expect.any(Error)
        );

        consoleErrorSpy.mockRestore();
    });

    it("should log error and exit if connection fails", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
        const processExitSpy = jest.spyOn(process, "exit") as unknown as jest.Mock;
        (processExitSpy as jest.Mock).mockImplementation(() => { });


        (mongoose.connect as jest.Mock).mockRejectedValueOnce(new Error("Connection failed"));

        DBConnection.getInstance();

        // Wait for async `connect()` inside constructor to finish
        await new Promise(setImmediate);

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            "MongoDB connection error:",
            expect.any(Error)
        );
        expect(processExitSpy).toHaveBeenCalledWith(1);

        consoleErrorSpy.mockRestore();
        processExitSpy.mockRestore();
    });

});
