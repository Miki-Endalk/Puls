import { StreamChat } from "stream-chat";
import type { User } from "stream-chat";
import env from "../config/env.js";

const apiKey = env.STREAM_API_KEY
const apiSecret = env.STREAM_API_SECRET

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData: User) => {
    try {
        await streamClient.upsertUser(userData)
        return userData
    } catch (error) {
        console.log("Error upserting stream user:", error)
    }
}

// TD-DO: do it later
export const generateStreamToken = (userId: string) => {

}