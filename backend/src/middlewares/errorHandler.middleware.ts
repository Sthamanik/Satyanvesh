import { ApiError } from "@utils/apiError.util.js";
import { NextFunction, Request, Response } from "express";
import { success } from "zod";

const errorHandler = (
    err: any,
    _: Request,
    res: Response,
    _next: NextFunction
) => {
    if ( err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode: err.statusCode,
            data: err.data,
            success: err.success,
            message: err.message || "Something went wrong",
            errors: err.errors || [],
        });
    }

    res.status( err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong",
        error: err.message || "Something went wrong",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};

export default errorHandler;