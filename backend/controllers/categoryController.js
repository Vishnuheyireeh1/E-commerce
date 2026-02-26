import Category from "../models/Category.js";

// @desc    Get all categories (For the Shop Sidebar)
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add New Category (Admin Only)
export const createCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;
        const category = await Category.create({ name, subCategories });
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: "Category already exists or invalid data" });
    }
};

// @desc    Update Category (Admin Only)
export const updateCategory = async (req, res) => {
    try {
        const { name, subCategories } = req.body;
        const category = await Category.findByIdAndUpdate(
            req.params.id, 
            { name, subCategories }, 
            { new: true }
        );
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete Category (Admin Only)
export const deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};