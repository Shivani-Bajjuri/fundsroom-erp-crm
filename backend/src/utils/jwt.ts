import jwt from "jsonwebtoken";

export const generateToken = (
  id: number,
  role: string,
  email: string
) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
    }
  );
};