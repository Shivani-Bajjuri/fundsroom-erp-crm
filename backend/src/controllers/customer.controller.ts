import { Request, Response } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addCustomerNote,
} from "../services/customer.service";

// Create Customer
export const addCustomer = async (req: Request, res: Response) => {
  try {
    const customer = await createCustomer(req.body);

    res.status(201).json({
      success: true,
      message: "Customer created successfully.",
      data: customer,
    });
  } catch (error: any) {
    console.error(error);

    const statusCode =
      error.message === "Customer already exists."
        ? 409
        : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Customers
export const fetchCustomers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const customers = await getAllCustomers(page, limit, search);

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Customer By ID
export const fetchCustomerById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const customer = await getCustomerById(id);

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error: any) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Customer
export const editCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const customer = await updateCustomer(id, req.body);

    res.status(200).json({
      success: true,
      message: "Customer updated successfully.",
      data: customer,
    });
  } catch (error: any) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Customer
export const removeCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await deleteCustomer(id);

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully.",
    });
  } catch (error: any) {
    console.error(error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const appendCustomerNote = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const note = req.body.note as string;

    const customer = await addCustomerNote(id, note);

    res.status(200).json({
      success: true,
      message: "Customer note added successfully.",
      data: customer,
    });
  } catch (error: any) {
    console.error(error);

    const statusCode =
      error.message === "Customer not found." ? 404 : 400;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};