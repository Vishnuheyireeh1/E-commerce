import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";


dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
    res.send("API Running");
});

app.use("/api/auth",authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT 

app.listen(PORT,()=>{
    console.log(`Server Running on Port ${PORT}`);
})