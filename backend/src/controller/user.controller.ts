import User, { type AuthenticatedUser } from "../models/User.js"
import type { Request, Response } from 'express'

export const getRecommendedUsers = async(
    req: Request, 
    res: Response<{ success: boolean, message: string, users?: AuthenticatedUser[] }>
) => {
    try {
        const currentUserId = req.user?._id
        const currentUser =  req.user

        const recommendedUser = await User.find({
            _id: {
                $ne: currentUserId,     //exclude current user
                $nin: currentUser?.friends      //exclude current user's freinds
            },
            isOnboarded: true
        })
        .select(["-password", "-friends"])
        .lean()

        if(recommendedUser.length === 0) {
            return res.status(404).json({
                success: false,
                message: "There are no users to recommend"
            })
        }

        res.status(200).json({
            success: true,
            message: "Recommended users sent successfully",
            users: recommendedUser
        })
    } catch (error) {
        console.log("Error in getRecommendedUsers controller:", error)
        res.json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const getMyFriends = async(
    req: Request, 
    res: Response
) => {
    try {
        
    } catch (error) {
        
    }
}