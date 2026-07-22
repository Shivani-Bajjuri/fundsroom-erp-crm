import { Router } from "express";
import {
  addCustomer,
  fetchCustomers,
  fetchCustomerById,
  editCustomer,
  removeCustomer,
  appendCustomerNote,
} from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Create Customer
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SALES"),
  addCustomer
);

// Get All Customers
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "SALES"),
  fetchCustomers
);

// Get Customer By ID
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES"),
  fetchCustomerById
);

// Update Customer
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SALES"),
  editCustomer
);

router.post(
  "/:id/notes",
  authenticate,
  authorize("ADMIN", "SALES"),
  appendCustomerNote
);

// Delete Customer
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  removeCustomer
);

export default router;