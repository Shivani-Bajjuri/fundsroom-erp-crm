import { Router } from "express";
import {
  addProduct,
  fetchProducts,
  fetchProductById,
  editProduct,
  removeProduct,
  fetchLowStockProducts,
} from "../controllers/product.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

console.log("Product routes loaded");

// Create Product
router.post(
  "/",
  authenticate,
  addProduct
);

// Get All Products
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES", "WAREHOUSE"),
  fetchProducts
);

// Low Stock Products
router.get(
  "/low-stock",
  authenticate,
  authorize("ADMIN", "WAREHOUSE"),
  fetchLowStockProducts
);

// Get Product By ID
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES", "WAREHOUSE"),
  fetchProductById
);

// Update Product
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "WAREHOUSE"),
  editProduct
);

// Delete Product
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  removeProduct
);

export default router;