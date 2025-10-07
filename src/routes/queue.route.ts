import { Router } from "express";
import {
  getAllQueue,
  getQueueById,
  createQueue,
  updateQueue,
  updateQueueStatus,
  deleteQueue,
  getCurrentQueue,
  getQueueMetrics,
  claimQueue,
  releaseQueue,
  nextQueue,
  skipQueue,
  resetQueue,
  serveQueue
} from "../controllers/queue.controller.js";

const router = Router();

// --- RUTE SPESIFIK (HARUS DI ATAS) ---
router.get("/current", getCurrentQueue);
router.get("/metrics", getQueueMetrics);

// --- RUTE UMUM & DINAMIS ---
router.get("/", getAllQueue);
router.get("/:id", getQueueById);

// --- RUTE AKSI ---
router.post("/", createQueue);
router.post("/claim", claimQueue);
router.post("/release", releaseQueue);
router.post("/next", nextQueue);
router.post("/skip", skipQueue);
router.post("/reset", resetQueue);
router.post("/serve", serveQueue);
router.put("/:id", updateQueue);
router.patch("/:id/status", updateQueueStatus);
router.delete("/:id", deleteQueue);



export default router;
