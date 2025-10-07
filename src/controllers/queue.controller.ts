import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";



const prisma = new PrismaClient();

// ✅ Get all queue
export const getAllQueue = async (req: Request, res: Response) => {
  try {
    const queues = await prisma.queue.findMany({
      include: { counter: true }, // harus include counter supaya frontend bisa pakai counter.name
      orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: queues });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Failed to fetch queues", error });
  }
};

// ✅ Get single queue detail
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

// ✅ Create queue
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

// ✅ Update queue (number / status)
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

// ✅ Update queue status (active/inactive/disable)
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

// ✅ Delete queue
export const deleteQueue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.queue.delete({ where: { id: Number(id) } });
    res.json({ message: "Queue deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete queue", detail: error.message });
  }
};

export const getCurrentQueue = async (req: Request, res: Response) => {
  try {
    // Ambil semua counter yang aktif
    const counters = await prisma.counter.findMany({
      where: { isActive: true },
      include: {
        queues: {
          where: {
            status: { in: ["CLAIMED", "CALLED", "SERVED", "SKIPPED"] }, // ambil hanya antrian aktif
          },
          orderBy: { createdAt: "asc" }, // urut dari yang paling awal diambil
        },
      },
    });

    // Bentuk hasil response biar lebih mudah dibaca di frontend
    const result = counters.map(c => ({
      counterId: c.id,
      counterName: c.name,
      maxQueue: c.maxQueue,
      isActive: c.isActive,
      queues: c.queues.map(q => ({
        id: q.id,
        number: q.number,
        status: q.status,
        createdAt: q.createdAt,
      })),
    }));

    res.json({
      status: true,
      data: result,
      message: "Berhasil ambil semua antrian aktif per counter",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Gagal ambil semua queue aktif",
      error: error.message,
    });
  }
};

export const getQueueMetrics = async (req: Request, res: Response) => {
  try {
    const waiting = await prisma.queue.count({
      where: { status: { in: ["CLAIMED", "CALLED"] } }
    });
    const served = await prisma.queue.count({
      where: { status: "SERVED" }
    });
    const skipped = await prisma.queue.count({
      where: { status: "SKIPPED" }
    });
    const called = await prisma.queue.count({
      where: { status: "CALLED" }
    });
    const released = await prisma.queue.count({
      where: { status: "RELEASED" }
    });
    

    res.json({
      success: true,
      data: { waiting, served, skipped, called, released },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch metrics", error });
  }
};


// POST /claim
export const claimQueue = async (req: Request, res: Response) => {
  try {
    // Ambil nomor antrian terakhir
    const lastQueue = await prisma.queue.findFirst({
      orderBy: { number: "desc" },
    });

    const nextNumber = lastQueue ? lastQueue.number + 1 : 1;

    // Pilih counter aktif pertama
    const counter = await prisma.counter.findFirst({
      where: { isActive: true },
    });

    if (!counter) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada counter aktif saat ini",
      });
    }

    // Buat nomor antrian baru
    const newQueue = await prisma.queue.create({
      data: {
        number: nextNumber,
        status: "CLAIMED",
        counterId: counter.id,
      },
    });

    // Hitung posisi antrian
    const positionQueue = await prisma.queue.count({
      where: {
        counterId: counter.id,
        status: "CLAIMED",
        number: { lt: nextNumber },
      },
    });

    const estimatedWaitTime = (positionQueue + 1) * 2;

    return res.json({
      success: true,
      data: {
        queueNumber: newQueue.number,
        counterName: counter.name,
        counterId: counter.id,
        positionQueue: positionQueue + 1,
        estimatedWaitTime,
      },
    });
  } catch (error: any) {
    console.error(error); // pastikan ini muncul di console server
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil nomor antrian",
      error: error.message || error,
    });
  }
};


export const serveQueue = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const queue = await prisma.queue.findUnique({ where: { id } });
    if (!queue) {
      return res.status(404).json({ success: false, message: "Queue tidak ditemukan" });
    }

    const updatedQueue = await prisma.queue.update({
      where: { id },
      data: { status: "SERVED" },
    });

    res.json({ success: true, data: updatedQueue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to mark queue as served", error });
  }
};


// POST /release
export const releaseQueue = async (req: Request, res: Response) => {
  try {
    const { queueNumber, counterId } = req.body;

    // cari queue yang sesuai
    const queueToRelease = await prisma.queue.findFirst({
      where: {
        counterId,
        number: queueNumber,
        status: "CLAIMED", // atau status lain yang sesuai
      }
    });

    if (!queueToRelease) {
      return res.status(404).json({
        success: false,
        message: "Queue tidak ditemukan atau sudah dilepas"
      });
    }

    const updatedQueue = await prisma.queue.update({
      where: { id: queueToRelease.id },
      data: { status: "RELEASED" }
    });

    res.json({ success: true, data: updatedQueue });
  } catch (error) {
    console.error("Error in releaseQueue:", error);
    res.status(500).json({ success: false, message: "Failed to release queue", error });
  }
};


// POST /next
// POST /next
export const nextQueue = async (req: Request, res: Response) => {
  try {
    const { counter_id } = req.body;

    // 1. Cari queue yang sedang CALLED di counter ini
    const currentQueue = await prisma.queue.findFirst({
      where: { counterId: counter_id, status: "CALLED" },
      orderBy: { createdAt: 'asc' }
    });

    let previousQueue: typeof currentQueue | null = null;

    // 2. Tandai queue sebelumnya sebagai SERVED
    if (currentQueue) {
      previousQueue = await prisma.queue.update({
        where: { id: currentQueue.id },
        data: { status: "SERVED" }
      });
    }

    // 3. Cari queue berikutnya yang CLAIMED
    const nextQueue = await prisma.queue.findFirst({
      where: { counterId: counter_id, status: "CLAIMED" },
      orderBy: { createdAt: 'asc' }
    });

    let updatedNextQueue = null;
    if (nextQueue) {
      updatedNextQueue = await prisma.queue.update({
        where: { id: nextQueue.id },
        data: { status: "CALLED" }
      });
    }

    res.json({ success: true, data: { queue: updatedNextQueue, previousQueue } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to call next queue", error });
  }
};



// POST /skip
export const skipQueue = async (req: Request, res: Response) => {
  try {
    const { counter_id } = req.body;

    const queueToSkip = await prisma.queue.findFirst({
      where: {
        counterId: counter_id,
        status: "CLAIMED" // antrian berikutnya yang belum dipanggil
      },
      orderBy: { createdAt: "asc" }
    });

    if (!queueToSkip) {
      return res.json({ success: false, message: "Tidak ada queue untuk dilewati" });
    }

    const updatedQueue = await prisma.queue.update({
      where: { id: queueToSkip.id },
      data: { status: "SKIPPED" }
    });

    res.json({ success: true, data: updatedQueue });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to skip queue", error });
  }
};

// POST /reset
export const resetQueue = async (req: Request, res: Response) => {
  try {
    const { counter_id } = req.body;

    // reset semua queue yang masih terkait dengan counter
    const resetQueues = await prisma.queue.updateMany({
      where: { counterId: counter_id },
      data: { number: 0, status: "0" }
    });

    res.json({ success: true, data: { affectedQueues: resetQueues.count } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to reset queue", error });
  }
};



