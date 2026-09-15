import { z } from "zod";
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
    PORT: z.string(),
    MONGODB_URI: z.string()
    .min(1, "MongoDB URI is required")
    .refine(
      (val) => val.startsWith("mongodb://") || val.startsWith("mongodb+srv://"),
      { message: "Must be a valid MongoDB connection string starting with mongodb:// or mongodb+srv://" }
    ),
})

const env = envSchema.parse(process.env)

export default env