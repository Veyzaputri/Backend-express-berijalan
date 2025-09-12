import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import type { IGlobalResponse, ILoginResponse } from "../interfaces/global.interface.js";
import { UGenerateToken } from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const SLogin = async (
  usernameOrEmail: string,
  password: string
): Promise<IGlobalResponse<ILoginResponse>> => {
  const admin = await prisma.admin.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      isActive: true,
      deletedAt: null
    },
  });

  if (!admin) throw new Error("Invalid Credentials");

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) throw new Error("Invalid Credentials");

  const token = UGenerateToken({
    id: admin.id,
    username: admin.username,
    email: admin.email,
    name: admin.name,
  });

  return {
    status: true,
    message: "Login Successful",
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
      },
    },
  };
};

export const SCreateAdmin = async (
  username: string,
  password: string,
  email: string,
  name: string
): Promise<IGlobalResponse<any>> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = await prisma.admin.create({
    data: { username, password: hashedPassword, email, name },
  });

  return {
    status: true,
    message: "Admin created successfully",
    data: newAdmin,
  };
};

export const SUpdateAdmin = async (
  id: number,
  data: { username?: string; password?: string; email?: string; name?: string }
): Promise<IGlobalResponse<any>> => {
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data,
    });

    return {
      status: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    };
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
      throw new Error("Admin not found");
    }
    throw new Error(err.message || "Failed to update admin");
  }
};

export const SDeleteAdmin = async (id: number): Promise<IGlobalResponse<any>> => {
  try {
    await prisma.admin.delete({ where: { id } });
    return {
      status: true,
      message: "Admin deleted successfully",
      data: null,
    };
  } catch (err: any) {
    if (err instanceof PrismaClientKnownRequestError && err.code === "P2025") {
      throw new Error("Admin not found");
    }
    throw new Error(err.message || "Failed to delete admin");
  }
};