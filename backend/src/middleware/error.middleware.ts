import { NextFunction, Request, Response } from "express";

export const notFound = (req: Request, res: Response) => {
	res.status(404).json({
		success: false,
		message: `Route not found: ${req.method} ${req.originalUrl}`,
	});
};

export const errorHandler = (
	error: unknown,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const message = error instanceof Error ? error.message : "Internal server error";

	if (res.headersSent) {
		return next(error);
	}

	res.status(res.statusCode && res.statusCode !== 200 ? res.statusCode : 500).json({
		success: false,
		message,
	});
};
