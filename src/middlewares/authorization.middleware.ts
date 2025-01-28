import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError.js";

declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                id: number
            }
        }
    }
}

export const checkOwnership = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        const gadget = await prisma?.gadget.findFirst({
            where: { id: Number(id) }
        });

        if (!gadget) {
            next(new ApiError({ statusCode: 404, message: 'Gadget not found' }));
            return;
        }

        if (gadget.userId !== userId) {
            next(new ApiError({
                statusCode: 403,
                message: "You are not authorized to modify this gadget"
            }));
            return;
        }

        next();
    } catch (error) {
        next(new ApiError({
            statusCode: 500,
            message: 'Error checking ownership',
        }));
    }
};