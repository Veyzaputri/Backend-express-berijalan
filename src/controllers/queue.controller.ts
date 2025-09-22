import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllQueue = async (req: Request, res: Response) => {
  try {
    const queues = await prisma.queue.findMany({
      include: { counter: true },
    });
    res.json(queues);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch queues", detail: error.message });
  }
};


export const getQueueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queue = await prisma.queue.findUnique({
      where: { id: Number(id) },
      include: { counter: true },
    });
    if (!queue) return res.status(404).json({ error: "Queue not found" });
    res.json(queue);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch queue", detail: error.message });
  }
};

export const createQueue = async (req: Request, res: Response) => {
  try {
    const { number, counterId } = req.body;
    const newQueue = await prisma.queue.create({
      data: {
        number,
        counterId,
      },
    });
    res.status(201).json(newQueue);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create queue", detail: error.message });
  }
};

export const updateQueue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { number, status } = req.body;

    const updatedQueue = await prisma.queue.update({
      where: { id: Number(id) },
      data: { number, status },
    });

    res.json(updatedQueue);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update queue", detail: error.message });
  }
};

export const updateQueueStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let updateData: any = {};

    if (status === "active") {
      updateData = { isActive: true, deletedAt: null };
    } else if (status === "inactive") {
      updateData = { isActive: false };
    } else if (status === "disable") {
      updateData = { deletedAt: new Date(), isActive: false };
    } else {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedQueue = await prisma.queue.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json(updatedQueue);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update queue status", detail: error.message });
  }
};

export const deleteQueue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.queue.delete({ where: { id: Number(id) } });
    res.json({ message: "Queue deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete queue", detail: error.message });
  }
};
