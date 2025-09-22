import { Router } from "express";
import * as counterController from "../controllers/counter.controller.js";

const router = Router();

router.get("/", counterController.getAllCounters);
router.get("/:id", counterController.getCounterById);
router.post("/", counterController.createCounter);
router.put("/:id", counterController.updateCounter);
router.patch("/:id/status", counterController.updateCounterStatus); // opsional update status
router.delete("/:id", counterController.deleteCounter);

export default router;
