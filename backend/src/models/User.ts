import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import type { InferSchemaType } from "mongoose";
import { string } from "zod";

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

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        if(error instanceof Error) {
            next(error)
        } else {
            next(new Error(String(error)))
        }
    }
})

type UserType = InferSchemaType<typeof userSchema>

const User = mongoose.model<UserType>("User", userSchema)
export default User