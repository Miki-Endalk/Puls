import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";

// interface User{
//     fullname: string
//     email: string
//     password: string
//     bio: string
//     profilePic: string
//     nativeLanguage: string
//     learningLanguage: string
//     location: string
//     isOnboarded: boolean
// }

const userSchema = new mongoose.Schema({
    fullname: {
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

type User = InferSchemaType<typeof userSchema>

const UserModel = mongoose.model("User", userSchema)
export default UserModel