import express from "express";
import { loginUser, registerUser, seedAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/seed", seedAdmin); 

export default router;