import bcrypt from "bcryptjs";
import prisma from "../db/db.js";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

export const userSignUp = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).json(
            new ApiResponse({
                success: false,
                message: "All fields are required: name, email, and password",
            })
        );
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            res.status(409).json(
                new ApiResponse({
                    success: false,
                    message: "User already exists. Please login instead.",
                })
            );
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        res.status(201).json(
            new ApiResponse({
                success: true,
                message: "User created successfully",
                data: {
                    userId: user.id,
                    email: user.email,
                    name: user.name
                }
            })
        );
        return;

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json(
            new ApiError({
                statusCode: 500,
                message: error instanceof Error ? error.message : "Error in signup process"
            })
        );
        return;
    }
};

export const userSignIn = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json(
            new ApiResponse({
                success: false,
                message: "Please provide both email and password",
            })
        );
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(404).json(
                new ApiResponse({
                    success: false,
                    message: "User not found",
                })
            );
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json(
                new ApiResponse({
                    success: false,
                    message: "Invalid password",

                })
            );
            return;
        }

        const token = jwt.sign(
            { email: user.email, id: user.id },
            process.env.JWT_SECRET_TOKEN || "default_secret",
            { expiresIn: "1h" }
        );

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(200).json(
            new ApiResponse({
                success: true,
                message: "User signed in successfully",
                data: {
                    userId: user.id,
                    email: user.email,
                    name: user.name
                }
            })
        );
        return;
    } catch (error) {
        console.error("Error during user sign-in:", error);
        res.status(500).json(
            new ApiError({
                message: error instanceof Error ? error.message : "An unexpected error occurred",
                statusCode: 500,
            })
        );
        return;
    }
};