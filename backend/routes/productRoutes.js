import express from "express";
const router = express.Router();
import { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;