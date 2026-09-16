import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

// interface UserType{
//     fullname: string
//     email: string
//     password: string
//     bio?: string
//     profilePic: string
//     nativeLanguage?: string
//     learningLanguage?: string
//     location?: string
//     isOnboarded?: boolean
//     friends?: mongoose.Types.ObjectId[];
// }

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    bio: {
        type: String,
        default: ""
    },

    profilePic: {
        type: String,
        default: ""
    },

    nativeLanguage: {
        type: String,
        default: ""
    },

    learningLanguage: {
        type: String,
        default: ""
    },

    location: {
        type: String,
        default: ""
    },

    isOnboarded: {
        type: Boolean,
        default: false
    },

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, {timestamps: true})

type UserType = InferSchemaType<typeof userSchema>

const User = mongoose.model<UserType>("User", userSchema)
export default User