import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCounters = async () => {
  return prisma.counter.findMany({
    include: {
      queues: true, // kalau mau ambil juga relasi
    },
  });
};

export const getCounterById = async (id: number) => {
  return prisma.counter.findUnique({
    where: { id },
    include: {
      queues: true,
    },
  });
};

export const createCounter = async (data: { name: string; maxQueue?: number }) => {
  return prisma.counter.create({
    data,
  });
};

export const updateCounter = async (id: number, data: { name?: string; maxQueue?: number }) => {
  return prisma.counter.update({
    where: { id },
    data,
  });
};

export const updateCounterStatus = async (
  id: number,
  status: "active" | "inactive" | "disable"
) => {
  if (status === "active") {
    return prisma.counter.update({
      where: { id },
      data: { isActive: true, deletedAt: null },
    });
  }
  if (status === "inactive") {
    return prisma.counter.update({
      where: { id },
      data: { isActive: false },
    });
  }
  if (status === "disable") {
    return prisma.counter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
};

export const deleteCounter = async (id: number) => {
  return prisma.counter.delete({
    where: { id },
  });
};
