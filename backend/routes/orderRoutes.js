import express from "express";
const router = express.Router();
import { 
    createOrder, 
    getMyOrders, 
    getOrderById,
    getAllOrders 
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js"; 

// USER ROUTES
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

router.get("/", protect, adminOnly, getAllOrders);


router.get("/:id", protect, getOrderById);

export default router;