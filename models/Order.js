import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, ref: 'user' },
    items: [{
        product: { type: String, required: true, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: 'address' },
    status: { type: String, required: true, default: 'Order Placed' },
    date: { type: Number, required: true } 
});

delete mongoose.models.order;
const Order = mongoose.model('order', orderSchema);

export default Order;
