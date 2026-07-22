import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
	createChallan,
	getAllChallans,
	getChallanById,
	updateChallanStatus,
} from "../services/challan.service";
import { ChallanStatus } from "@prisma/client";

const parseStatus = (value: unknown) => {
	if (typeof value !== "string") {
		return undefined;
	}

	const normalized = value.toUpperCase();

	return Object.values(ChallanStatus).includes(normalized as ChallanStatus)
		? (normalized as ChallanStatus)
		: undefined;
};

export const addChallan = async (req: AuthRequest, res: Response) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const challan = await createChallan(req.body, req.user.id);

		res.status(201).json({
			success: true,
			message: "Challan created successfully.",
			data: challan,
		});
	} catch (error: any) {
		console.error(error);

		const statusCode =
			error.message === "Insufficient stock for product" ||
			error.message.startsWith("Insufficient stock for product:")
				? 400
				: error.message === "Customer not found." ||
					error.message === "One or more products not found." ||
					error.message === "Challan not found."
				? 404
				: 400;

		res.status(statusCode).json({
			success: false,
			message: error.message,
		});
	}
};

export const fetchChallans = async (req: AuthRequest, res: Response) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 10;
		const search = req.query.search as string | undefined;
		const status = parseStatus(req.query.status);

		const challans = await getAllChallans({
			page,
			limit,
			search,
			status,
		});

		res.status(200).json({
			success: true,
			data: challans,
		});
	} catch (error: any) {
		console.error(error);

		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const fetchChallanById = async (req: AuthRequest, res: Response) => {
	try {
		const id = Number(req.params.id);

		const challan = await getChallanById(id);

		res.status(200).json({
			success: true,
			data: challan,
		});
	} catch (error: any) {
		console.error(error);

		res.status(404).json({
			success: false,
			message: error.message,
		});
	}
};

export const changeChallanStatus = async (
	req: AuthRequest,
	res: Response
) => {
	try {
		if (!req.user?.id) {
			return res.status(401).json({
				success: false,
				message: "Unauthorized",
			});
		}

		const id = Number(req.params.id);
		const status = parseStatus(req.body.status);

		if (!status) {
			return res.status(400).json({
				success: false,
				message: "Valid challan status is required.",
			});
		}

		const challan = await updateChallanStatus(id, status, req.user.id);

		res.status(200).json({
			success: true,
			message: "Challan status updated successfully.",
			data: challan,
		});
	} catch (error: any) {
		console.error(error);

		const statusCode =
			error.message === "Challan not found." ? 404 : 400;

		res.status(statusCode).json({
			success: false,
			message: error.message,
		});
	}
};
