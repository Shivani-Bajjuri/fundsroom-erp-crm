import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { Role } from "@prisma/client";

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginData {
  email: string;
  password: string;
}

export const signup = async ({
  name,
  email,
  password,
  role,
}: SignupData) => {
  // Validate role
  if (!Object.values(Role).includes(role)) {
    throw new Error("Invalid role");
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  // Validate password
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  // Generate JWT
  const token = generateToken(user.id, user.role, user.email);

  return {
    token,
    user,
  };
};

export const login = async ({ email, password }: LoginData) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user.id, user.role, user.email);

  return {
    token,
    user,
  };
};