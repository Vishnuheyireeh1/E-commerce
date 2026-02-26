import express from "express";
const router = express.Router();
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from "../controllers/categoryController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.get("/", getCategories);

router.post("/", protect, adminOnly, createCategory);
router.put("/:id", protect, adminOnly, updateCategory);
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;