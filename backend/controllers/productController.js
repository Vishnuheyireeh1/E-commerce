import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const { category, search, sort, page = 1 } = req.query;
        const limit = 9;
        const skip = (page - 1) * limit;

        let query = {};
        
        // Filter by Category ID
        if (category && category !== "All") {
            query.category = category;
        }

        // Search by Name (Case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // Sorting Logic
        let sortOption = { createdAt: -1 }; 
        if (sort === "price-low") sortOption = { price: 1 };
        if (sort === "price-high") sortOption = { price: -1 };

        const products = await Product.find(query)
            .populate("category", "name") 
            .sort(sortOption)
            .limit(limit)
            .skip(skip);

        const totalProducts = await Product.countDocuments(query);

        res.status(200).json({
            products,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / limit),
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("category", "name");
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Product (Admin Only)
export const createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update Product (Admin Only)
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete Product (Admin Only)
export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};