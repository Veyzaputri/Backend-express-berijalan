import { Router } from "express";
import { CLogin, CCreateAdmin, CUpdateAdmin, CDeleteAdmin } from '../controllers/auth.controller.js';
import { MValidate } from "../validators/auth.validator.js";
import Joi from "joi";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = Router();

const createAdminSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(2).required(),
});

const updateAdminSchema = Joi.object({
  username: Joi.string().min(3).optional(),
  password: Joi.string().min(6).optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().min(2).optional(),
});

router.post("/create", MValidate(createAdminSchema), asyncHandler(CCreateAdmin));
router.put("/:id", MValidate(updateAdminSchema), asyncHandler(CUpdateAdmin));
router.delete("/:id", asyncHandler(CDeleteAdmin));
router.post("/login", asyncHandler(CLogin));

export default router;
