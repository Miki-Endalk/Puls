import jwt from "jsonwebtoken";
import User from "../models/User.js";
import type { NextFunction, Request, Response } from "express";
import env from "../config/env.js";

interface CustomJwtPayload extends jwt.JwtPayload {
    userId: string
}

export const protectRoute = async (
    req: Request,
    res: Response<{ success: boolean, message: string }>,
    next: NextFunction
) => {
    try {
        const token = req.cookies.jwt

        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - no token was provided"
            })
        }

        const decoded = jwt.verify(token, env.JWT_SECRET_KEY)

        if(typeof decoded !== 'object' || decoded === null || !('userId' in decoded) || typeof decoded.userId !== "string") {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - invalid token was provided"
            })
        }

        const customPayload = decoded as CustomJwtPayload
        const id = customPayload.userId

        const user = await User.findById(id)
            .select(["-password"])
            .lean()

        if(!user) {
             return res.status(401).json({
                success: false,
                message: "Unauthorized - user not found"
            })
        }

        req.user = user

        next()
    } catch (error) {
        console.log("Error in protectRoute middleware:", error)
        res.status(500).json({
            success: false,
            message: "Internal server error",
        })
    }
}