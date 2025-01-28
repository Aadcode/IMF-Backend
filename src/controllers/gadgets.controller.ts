import prisma from "../db/db.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import { Request, Response } from "express";

import { StatusEnum } from '@prisma/client';
export const getAllGadgets = async (req: Request, res: Response): Promise<void> => {


    try {
        if (req.query.status && !Object.values(StatusEnum).includes(req.query.status as StatusEnum)) {
            res.status(400).json(
                new ApiError({
                    statusCode: 400,
                    message: "Invalid status parameter",
                })
            );
            return;
        }

        const whereClause = req.query.status ? { status: req.query.status as StatusEnum } : {};

        const gadgets = await prisma.gadget.findMany({
            where: whereClause,
            select: { id: true, name: true, status: true },
        });

        const response = gadgets.map((gadget) => ({
            ...gadget,
            mission_success_probability: Math.floor(Math.random() * 10),
        }));

        res.status(200).json(
            new ApiResponse({
                success: true,
                message: "Gadgets fetched successfully",
                data: response,
            })
        );
    } catch (err) {
        console.error("Error fetching gadgets:", err);
        res.status(500).json(
            new ApiError({
                statusCode: 500,
                message: err instanceof Error ? err.message : "Internal Server Error",
            })
        );
    }
};
export const createGadget = async (req: Request, res: Response): Promise<void> => {
    const { name, gadgetStatus } = req.body;

    if (!name || !gadgetStatus) {
        res.status(400).json(
            new ApiResponse({
                success: false,
                message: "Please Provide All Fields"
            })
        );
        return;
    }

    try {
        const createdGadget = await prisma.gadget.create({
            data: {
                name,
                status: gadgetStatus,
                userId: Number(req.user?.id)
            }
        });

        res.status(201).json(
            new ApiResponse({
                success: true,
                message: "Gadget Created Successfully",
                data: createdGadget
            })
        );
    } catch (e) {
        res.status(500).json(
            new ApiError({
                message: e instanceof Error ? e.message : "Error in Creating Gadget",
                statusCode: 500,
            })
        );
    }
};

export const updateGadget = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(id, status)

    if (!id || !status) {
        res.status(400).json(
            new ApiResponse({
                success: false,
                message: "ID and status are required"
            })
        );
        return;
    }

    try {
        const updatedGadget = await prisma.gadget.update({
            where: { id: Number(id) },
            data: { status }
        });

        res.status(200).json(
            new ApiResponse({
                success: true,
                message: "Gadget updated successfully",
                data: updatedGadget
            })
        );
    } catch (error) {
        res.status(500).json(
            new ApiError({
                statusCode: 500,
                message: error instanceof Error ? error.message : "Error updating gadget"
            })
        );
    }
};

export const deleteGadget = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json(
            new ApiResponse({
                success: false,
                message: "ID is required"
            })
        );
        return;
    }

    try {
        const deletedGadget = await prisma.gadget.update({
            where: { id: Number(id) },
            data: { status: "Decommissioned" }
        });

        res.status(200).json(
            new ApiResponse({
                success: true,
                message: "Gadget deleted successfully",
                data: deletedGadget
            })
        );
    } catch (error) {
        res.status(500).json(
            new ApiError({
                statusCode: 500,
                message: error instanceof Error ? error.message : "Error deleting gadget"
            })
        );
    }
};

const tempConfirmationCodes: { [key: string]: number } = {};

const generateConfirmationCode = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const destructGadget = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { action } = req.query;

        if (!id || isNaN(Number(id))) {
            res.status(400).json(
                new ApiError({
                    message: "Invalid gadget ID",
                    statusCode: 400
                })
            );
            return;
        }

        if (action === 'getCode') {
            const confirmationCode = generateConfirmationCode();
            tempConfirmationCodes[id] = confirmationCode;

            setTimeout(() => {
                delete tempConfirmationCodes[id];
            }, 5 * 60 * 1000);

            res.status(200).json({ confirmationCode });
            return;
        }

        const { verificationCode } = req.body;

        if (!verificationCode) {
            res.status(400).json(
                new ApiError({
                    message: "Verification code is required",
                    statusCode: 400
                })
            );
            return;
        }

        const expectedCode = tempConfirmationCodes[id];
        if (!expectedCode) {
            res.status(403).json(
                new ApiError({
                    message: "Confirmation code expired or not found",
                    statusCode: 403
                })
            );
            return;
        }

        if (verificationCode !== expectedCode) {
            res.status(403).json(
                new ApiError({
                    message: "Invalid verification code",
                    statusCode: 403
                })
            );
            return;
        }

        const gadget = await prisma.gadget.delete({
            where: { id: Number(id) },
        });

        delete tempConfirmationCodes[id];

        res.status(200).json(
            new ApiResponse({
                success: true,
                message: "Gadget deleted successfully",
                data: gadget
            })
        );
    } catch (error) {
        console.error('Error in destroyGadget:', error);
        res.status(500).json(
            new ApiError({
                message: error instanceof Error ? error.message : "Error deleting gadget",
                statusCode: 500
            })
        );
    }
};