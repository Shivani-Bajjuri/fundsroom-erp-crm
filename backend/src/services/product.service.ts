import prisma from "../config/prisma";

interface CreateProductData {
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  stock: number;
  minStock: number;
  location: string;
}

type UpdateProductData = Partial<CreateProductData>;

const findProductByIdOrThrow = async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Valid product id is required.");
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new Error("Product not found.");
  }

  return product;
};

export const createProduct = async ({
  name,
  sku,
  category,
  unitPrice,
  stock,
  minStock,
  location,
}: CreateProductData) => {
    if (
      !name ||
      !sku ||
      !category ||
      unitPrice === undefined ||
      stock === undefined ||
      minStock === undefined ||
      !location
    ) {
      throw new Error("Please fill all required fields.");
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        sku,
      },
    });

    if (existingProduct) {
      throw new Error("Product SKU already exists.");
    }

    return await prisma.product.create({
      data: {
        name,
        sku,
        category,
        unitPrice,
        stock,
        minStock,
        location,
      },
    });
  };

  export const getAllProducts = async (
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
              sku: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });

    const totalProducts = await prisma.product.count({
      where,
    });

    return {
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    };
  };

  export const getProductById = async (id: number) => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Valid product id is required.");
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  };

  export const updateProduct = async (
    id: number,
    data: UpdateProductData
  ) => {
    await findProductByIdOrThrow(id);

    if (data.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          sku: data.sku,
          NOT: {
            id,
          },
        },
      });

      if (existingProduct) {
        throw new Error("Product SKU already exists.");
      }
    }

    return await prisma.product.update({
      where: {
        id,
      },
      data,
    });
  };

  export const deleteProduct = async (id: number) => {
    await findProductByIdOrThrow(id);

    await prisma.product.delete({
      where: {
        id,
      },
    });
  };

  export const getLowStockProducts = async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        stock: "asc",
      },
    });

    return products.filter(
      (product: CreateProductData) => product.stock <= product.minStock
    );
  };