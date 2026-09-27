import type { Request, Response } from "express";
import User, { type AuthenticatedUser, type UserType } from "../models/User.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";
import { boolean } from "zod";

export const signup = async (
  req: Request<
    {},
    unknown,
    { firstName: string; lastName: string; email: string; password: string }
  >,
  res: Response<{
    success: boolean;
    message?: string;
    user?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profilePic: string;
    };
  }>,
) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists, please use a different one",
      });
    }

    const indx = Math.floor(Math.random() * 1000) + 1;
    const randomAvatar = `https://api.dicebear.com/10.x/initial-face/svg?seed=${firstName + lastName + "-" + indx.toString()}&tags=animation&size=64&borderRadius=50`;

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      profilePic: randomAvatar,
    });

    const fullName = newUser.firstName + " " + newUser.lastName;

    const user = {
      _id: newUser._id.toString(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    };

    // Create the user in Stream
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    const token = jwt.sign({ userId: newUser._id }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevents XSS attacks
      sameSite: true, // prevents CSRF attacks
      secure: env.NODE_ENV === "production",
    });

    res.status(201).json({
      success: true,
      message: "New user has been created successfully",
      user: user,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<{
    success: boolean;
    message?: string;
    user?: {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      profilePic: string;
    };
  }>,
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const existingUser = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      profilePic: user.profilePic,
    };

    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure: env.NODE_ENV === "production",
    });

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: existingUser,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = (
  req: Request,
  res: Response<{ success: boolean; message: string }>,
) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const onboard = async (
  req: Request<
    {},
    {},
    {
      firstName: string;
      lastName: string;
      bio: string;
      nativeLanguage: string;
      learningLanguage: string;
      location: string;
    }
  >,
  res: Response<{
    success: boolean;
    message: string;
    missingFields?: (string | boolean)[];
    user?: AuthenticatedUser;
  }>,
) => {
  try {
    const userId = req.user?._id;

    const {
      firstName,
      lastName,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        missingFields: [
          !firstName && "First Name",
          !lastName && "Last Name",
          !bio && "Bio",
          !nativeLanguage && "Native Language",
          !learningLanguage && "Learning Language",
          !location && "Location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        bio,
        nativeLanguage,
        learningLanguage,
        location,
        isOnboarded: true,
      },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // TO-DO: UPDATE THE USER INFO IN STREAM

    res.status(200).json({
      success: true,
      message: "Onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in onboard controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
