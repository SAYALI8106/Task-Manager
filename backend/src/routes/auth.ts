import express from "express";
import * as AuthController from "./../controllers/authController";
import { validateLogin, validateRegister } from "../middlewares/validateAuth";
import { authenticate } from "../middlewares/auth";

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateRegister, AuthController.register);

// POST /api/auth/login
router.post("/login", validateLogin, AuthController.login);

// POST /api/auth/logout
router.post("/logout", AuthController.logout);

// GET /api/auth/profile
router.get("/profile", authenticate, AuthController.getCurrentUser);

export default router;
