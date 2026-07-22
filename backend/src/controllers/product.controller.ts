import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from "../services/product.service";

const getProductErrorStatus = (message: string) => {
  if (message === "Product SKU already exists.") {
    return 409;
  }

  if (message === "Product not found.") {
    return 404;
  }

  return 400;
};

// Create Product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const product = await createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    const statusCode =
      error.message === "Product SKU already exists." ? 409 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Products
export const fetchProducts = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const products = await getAllProducts(page, limit, search);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Product By ID
export const fetchProductById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product id is required.",
      });
    }

    const product = await getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Product
export const editProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product id is required.",
      });
    }

    const product = await updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error: any) {
    console.error(error);

    const statusCode = getProductErrorStatus(error.message);

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Product
export const removeProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product id is required.",
      });
    }

    await deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Low Stock Products
export const fetchLowStockProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getLowStockProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};