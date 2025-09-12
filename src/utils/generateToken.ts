import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string | number;
  username: string;
  email: string;
  name: string;
}

export const UGenerateToken = (payload: TokenPayload): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d", // expired dalam 1 hari, bisa diubah sesuai kebutuhan
  });
};
