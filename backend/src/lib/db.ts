import mongoose from "mongoose";
import env from "../config/env.js";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`)
        process.exit(1)
    }
}