import prisma from "../config/prisma";

type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";

interface CreateCustomerData {
  name: string;
  mobile: string;
  email: string;
  businessName: string;
  gst?: string;
  type: CustomerType;
  address: string;
  status: CustomerStatus;
  followUpDate?: Date;
  notes?: string;
}

export const createCustomer = async ({
  name,
  mobile,
  email,
  businessName,
  gst,
  type,
  address,
  status,
  followUpDate,
  notes,
}: CreateCustomerData) => {
  // Required field validation
  if (
    !name ||
    !mobile ||
    !email ||
    !businessName ||
    !type ||
    !address ||
    !status
  ) {
    throw new Error("Please fill all required fields.");
  }

  // Duplicate email check
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      email,
    },
  });

  if (existingCustomer) {
    throw new Error("Customer already exists.");
  }

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      name,
      mobile,
      email,
      businessName,
      gst,
      type,
      address,
      status,
      followUpDate,
      notes,
    },
  });

  return customer;
};

export const getAllCustomers = async (
  page: number,
  limit: number,
  search?: string
) => {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            mobile: {
              contains: search,
            },
          },
          {
            businessName: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }
    : {};

  const customers = await prisma.customer.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      id: "desc",
    },
  });

  const totalCustomers = await prisma.customer.count({
    where,
  });

  return {
    totalCustomers,
    currentPage: page,
    totalPages: Math.ceil(totalCustomers / limit),
    customers,
  };
};

export const getCustomerById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  return customer;
};

export const updateCustomer = async (
  id: number,
  data: Partial<CreateCustomerData>
) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  return await prisma.customer.update({
    where: {
      id,
    },
    data,
  });
};

export const deleteCustomer = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id,
    },
  });

  if (!customer) {
    throw new Error("Customer not found.");
  }

  await prisma.customer.delete({
    where: {
      id,
    },
  });

  return;
};