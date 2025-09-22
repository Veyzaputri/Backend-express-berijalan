import { Router } from "express";
import {
  getAllQueue,
  getQueueById,
  createQueue,
  updateQueue,
  updateQueueStatus,
  deleteQueue,
} from "../controllers/queue.controller.js";

const router = Router();

router.get("/", getAllQueue);
router.get("/:id", getQueueById);
router.post("/", createQueue);
router.put("/:id", updateQueue);
router.patch("/:id/status", updateQueueStatus);
router.delete("/:id", deleteQueue);

export default router;
