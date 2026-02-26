import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { 
    name: String,
    price: Number,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  },
  shippingAddress: { type: String, required: true },
  status: { type: String, default: 'Processing' }, 
  paymentStatus: { type: String, enum: ['Success', 'Failed'], required: true }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);