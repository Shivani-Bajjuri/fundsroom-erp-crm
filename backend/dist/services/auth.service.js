"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const client_1 = require("@prisma/client");
const signup = async ({ name, email, password }) => {
    // Check if admin already exists
    const existingAdmin = await prisma_1.default.user.findFirst({
        where: {
            role: client_1.Role.ADMIN,
        },
    });
    if (existingAdmin) {
        throw new Error("Admin account already exists");
    }
    // Check email
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error("Email already registered");
    }
    // Hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    // Create admin
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: client_1.Role.ADMIN,
        },
    });
    const token = (0, jwt_1.generateToken)(user.id, user.role, user.email);
    return {
        token,
        user,
    };
};
exports.signup = signup;
const login = async ({ email, password }) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }
    const token = (0, jwt_1.generateToken)(user.id, user.role, user.email);
    return {
        token,
        user,
    };
};
exports.login = login;
