import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};