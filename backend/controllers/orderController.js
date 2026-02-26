import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc    Create New Order (Direct Buy)
export const createOrder = async (req, res) => {
    try {
        const { productId, shippingAddress, paymentStatus, totalAmount } = req.body;

        // 1. Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock <= 0) {
            return res.status(400).json({ message: "Product is out of stock, bruh!" });
        }

        // 2. Only process if payment was 'Success' (Simulated from Frontend)
        if (paymentStatus !== "Success") {
            return res.status(400).json({ message: "Payment failed. Order not created." });
        }

        // 3. Create the Order
        const order = await Order.create({
            user: req.user._id, // From protect middleware
            product: {
                productId: product._id,
                name: product.name,
                price: totalAmount || product.price // Snapshot of price
            },
            shippingAddress,
            paymentStatus: "Success",
            status: "Processing"
        });

        // 4. MANDATORY: Reduce Stock
        product.stock -= 1;
        await product.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Logged-in User Orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Order By ID (Full Details)
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email");
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Security check: Only the owner or an admin can see the detail
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Not authorized to view this receipt" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Orders (Admin Only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email") 
            .sort("-createdAt");
            
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};