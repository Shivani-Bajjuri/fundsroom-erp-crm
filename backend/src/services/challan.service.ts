import { ChallanStatus, MovementType, Prisma } from "@prisma/client";
import prisma from "../config/prisma";
import { generateChallanNumber } from "../utils/generateChallan";

type ChallanStatusValue = ChallanStatus;

interface ChallanItemInput {
	productId: number;
	quantity: number;
}

interface CreateChallanData {
	customerId: number;
	items: ChallanItemInput[];
	status?: ChallanStatusValue;
}

interface ListChallanFilters {
	page?: number;
	limit?: number;
	search?: string;
	status?: ChallanStatusValue;
}

const allowedStatuses = Object.values(ChallanStatus);

const validateItems = (items: ChallanItemInput[]) => {
	if (!Array.isArray(items) || items.length === 0) {
		throw new Error("At least one product is required.");
	}

	items.forEach((item, index) => {
		if (!Number.isInteger(item.productId) || item.productId <= 0) {
			throw new Error(`Invalid product id at item ${index + 1}.`);
		}

		if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
			throw new Error(`Invalid quantity at item ${index + 1}.`);
		}
	});
};

const ensureStockAvailability = (
	product: { id: number; name: string; stock: number },
	quantity: number
) => {
	if (product.stock < quantity) {
		throw new Error(`Insufficient stock for product: ${product.name}`);
	}
};

const recordInventoryMovement = async (
	tx: Prisma.TransactionClient,
	params: {
		productId: number;
		quantity: number;
		movement: MovementType;
		reason: string;
		createdBy: number;
	}
) => {
	await tx.inventoryLog.create({
		data: params,
	});
};

const applyStockReduction = async (
	tx: Prisma.TransactionClient,
	items: ChallanItemInput[],
	createdBy: number,
	reason: string
) => {
	const products = await tx.product.findMany({
		where: {
			id: {
				in: items.map((item) => item.productId),
			},
		},
	});

	if (products.length !== items.length) {
		throw new Error("One or more products not found.");
	}

	for (const item of items) {
		const product = products.find((row) => row.id === item.productId);

		if (!product) {
			throw new Error("One or more products not found.");
		}

		ensureStockAvailability(product, item.quantity);

		await tx.product.update({
			where: {
				id: product.id,
			},
			data: {
				stock: {
					decrement: item.quantity,
				},
			},
		});

		await recordInventoryMovement(tx, {
			productId: product.id,
			quantity: item.quantity,
			movement: MovementType.OUT,
			reason,
			createdBy,
		});
	}
};

const applyStockRestoration = async (
	tx: Prisma.TransactionClient,
	items: { productId: number; quantity: number }[],
	createdBy: number,
	reason: string
) => {
	for (const item of items) {
		await tx.product.update({
			where: {
				id: item.productId,
			},
			data: {
				stock: {
					increment: item.quantity,
				},
			},
		});

		await recordInventoryMovement(tx, {
			productId: item.productId,
			quantity: item.quantity,
			movement: MovementType.IN,
			reason,
			createdBy,
		});
	}
};

export const createChallan = async (
	data: CreateChallanData,
	createdBy: number
) => {
	const customerId = Number(data.customerId);
	const items = data.items;
	const requestedStatus = data.status ?? ChallanStatus.DRAFT;

	if (!Number.isInteger(customerId) || customerId <= 0) {
		throw new Error("Valid customer is required.");
	}

	if (!allowedStatuses.includes(requestedStatus)) {
		throw new Error("Invalid challan status.");
	}

	if (!Number.isInteger(createdBy) || createdBy <= 0) {
		throw new Error("Created by user is required.");
	}

	validateItems(items);

	const createdChallan = await prisma.$transaction(async (tx) => {
		const customer = await tx.customer.findUnique({
			where: {
				id: customerId,
			},
		});

		if (!customer) {
			throw new Error("Customer not found.");
		}

		const lastChallan = await tx.salesChallan.findFirst({
			orderBy: {
				id: "desc",
			},
			select: {
				challanNumber: true,
			},
		});

		const challanNumber = generateChallanNumber(lastChallan?.challanNumber);
		const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

		const products = await tx.product.findMany({
			where: {
				id: {
					in: items.map((item) => item.productId),
				},
			},
		});

		if (products.length !== items.length) {
			throw new Error("One or more products not found.");
		}

		if (requestedStatus === ChallanStatus.CONFIRMED) {
			for (const item of items) {
				const product = products.find((row) => row.id === item.productId);

				if (!product) {
					throw new Error("One or more products not found.");
				}

				ensureStockAvailability(product, item.quantity);
			}
		}

		const challan = await tx.salesChallan.create({
			data: {
				challanNumber,
				customerId,
				status: requestedStatus,
				totalQuantity,
				createdBy,
				items: {
					create: items.map((item) => {
						const product = products.find((row) => row.id === item.productId);

						if (!product) {
							throw new Error("One or more products not found.");
						}

						return {
							productId: product.id,
							productName: product.name,
							unitPrice: product.unitPrice,
							quantity: item.quantity,
						};
					}),
				},
			},
		});

		if (requestedStatus === ChallanStatus.CONFIRMED) {
			await applyStockReduction(
				tx,
				items,
				createdBy,
				`Challan ${challanNumber} confirmed`
			);
		}

		return challan;
	}, {
		timeout: 15000,
	});

	return await getChallanById(createdChallan.id);
};

export const getAllChallans = async ({
	page = 1,
	limit = 10,
	search,
	status,
}: ListChallanFilters) => {
	const skip = (page - 1) * limit;

	const where: Prisma.SalesChallanWhereInput = {
		...(status ? { status } : {}),
		...(search
			? {
					OR: [
						{
							challanNumber: {
								contains: search,
								mode: "insensitive",
							},
						},
						{
							customer: {
								name: {
									contains: search,
									mode: "insensitive",
								},
							},
						},
					],
				}
			: {}),
	};

	const challans = await prisma.salesChallan.findMany({
		where,
		skip,
		take: limit,
		orderBy: {
			id: "desc",
		},
		include: {
			customer: true,
			user: true,
			items: {
				include: {
					product: true,
				},
			},
		},
	});

	const totalChallans = await prisma.salesChallan.count({
		where,
	});

	return {
		totalChallans,
		currentPage: page,
		totalPages: Math.ceil(totalChallans / limit),
		challans,
	};
};

export const getChallanById = async (id: number) => {
	const challan = await prisma.salesChallan.findUnique({
		where: {
			id,
		},
		include: {
			customer: true,
			user: true,
			items: {
				include: {
					product: true,
				},
			},
		},
	});

	if (!challan) {
		throw new Error("Challan not found.");
	}

	return challan;
};

export const updateChallanStatus = async (
	id: number,
	status: ChallanStatusValue,
	userId: number
) => {
	if (!allowedStatuses.includes(status)) {
		throw new Error("Invalid challan status.");
	}

	return await prisma.$transaction(async (tx) => {
		const challan = await tx.salesChallan.findUnique({
			where: {
				id,
			},
			include: {
				items: true,
			},
		});

		if (!challan) {
			throw new Error("Challan not found.");
		}

		if (challan.status === status) {
			return challan;
		}

		if (challan.status === ChallanStatus.CANCELLED) {
			throw new Error("Cancelled challan cannot be changed.");
		}

		if (status === ChallanStatus.DRAFT) {
			throw new Error("Confirmed challan cannot be reverted to draft.");
		}

		if (status === ChallanStatus.CONFIRMED && challan.status === ChallanStatus.DRAFT) {
			await applyStockReduction(
				tx,
				challan.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
				userId,
				`Challan ${challan.challanNumber} confirmed`
			);
		}

		if (status === ChallanStatus.CANCELLED && challan.status === ChallanStatus.CONFIRMED) {
			await applyStockRestoration(
				tx,
				challan.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
				})),
				userId,
				`Challan ${challan.challanNumber} cancelled`
			);
		}

		return await tx.salesChallan.update({
			where: {
				id,
			},
			data: {
				status,
			},
			include: {
				customer: true,
				user: true,
				items: {
					include: {
						product: true,
					},
				},
			},
		});
	});
};
