import type { Request, Response } from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import env from "../config/env.js"

export const signup = async (
    req: Request<{}, unknown, { firstName: string, lastName: string, email: string, password: string }>,
    res: Response<{success: boolean, message?: string, 
        user?: {
            _id: string;
            firstName: string;
            lastName: string;
            email: string;
            profilePic: string
        }
    }>
) => {
    const { firstName, lastName, email, password } = req.body
    
    try {
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if(password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if(!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists, please use a different one"
            })
        }

        const indx = Math.floor(Math.random() * 1000) + 1
        const randomAvatar = `https://api.dicebear.com/10.x/initial-face/svg?seed=${firstName + lastName + "-" + indx.toString()}&tags=animation&size=64&borderRadius=50`
        
        const newUser = await User.create({
            firstName, 
            lastName,
            email,
            password,
            profilePic: randomAvatar
        })

        const user = {
            _id: newUser._id.toString(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            profilePic: newUser.profilePic
        }

        // TO-DO: Create the user in stream as well

        const token = jwt.sign({userId: newUser._id}, env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // prevents XSS attacks
            sameSite: true, // prevents CSRF attacks
            secure: env.NODE_ENV === "production"
        })

        res.status(201).json({
            success: true,
            message: "New user has been created successfully",
            user: user
        })
    } catch (error) {
        console.log("Error in signup controller:", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const login = async (
    req: Request, 
    res: Response
) => {
    res.send('Login')
}

export const logout = (
    req: Request, 
    res: Response
) => {
    res.send('Logout')
}