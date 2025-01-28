import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import jwt, { JwtPayload } from "jsonwebtoken";



export const loginCheck = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['authToken'];
    console.log(token)

    if (!token) {
        res.status(401).json({ message: 'User not logged in' });
        return
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN || "") as JwtPayload;


        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'email' in decoded) {
            req.user = { id: decoded.id, email: decoded.email };
            next();
        } else {
            res.status(401).json({ message: 'Invalid token payload' });
            return
        }
    } catch (err) {
        const error = new ApiError({ statusCode: 500, message: "Invalid token" });
        res.status(401).json(error);
        return
    }
};
