import type { Request, Response } from "express";
import * as counterService from "../services/counter.service.js";
//import { ICreateCounterRequest } from '@/interfaces/service/counter.interface';

export const getAllCounters = async (req: Request, res: Response) => {
  try {
    const counters = await counterService.getAllCounters();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counters" });
  }
};

export const getCounterById = async (req: Request, res: Response) => {
  try {
    const counter = await counterService.getCounterById(Number(req.params.id));
    if (!counter) return res.status(404).json({ error: "Counter not found" });
    res.json(counter);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch counter" });
  }
};

export const createCounter = async (req: Request, res: Response) => {
  try {
    const { name, maxQueue } = req.body; // ambil dari request body

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // panggil service prisma
    const newCounter = await counterService.createCounter({
      name,
      maxQueue: maxQueue ?? 50, // default 50
    });

    res.status(201).json(newCounter);
  } catch (err: any) {
    console.error("Failed to create counter:", err);
    res.status(500).json({ error: "Failed to create counter" });
  }
};


export const updateCounter = async (req: Request, res: Response) => {
  try {
    const counter = await counterService.updateCounter(Number(req.params.id), req.body);
    res.json(counter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update counter" });
  }
};

export const updateCounterStatus = async (req: Request, res: Response) => {
  try {
    const counter = await counterService.updateCounterStatus(Number(req.params.id), req.body.status);
    res.json(counter);
  } catch (err) {
    res.status(500).json({ error: "Failed to update counter status" });
  }
};

export const deleteCounter = async (req: Request, res: Response) => {
  try {
    await counterService.deleteCounter(Number(req.params.id));
    res.json({ message: "Counter deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete counter" });
  }
};
