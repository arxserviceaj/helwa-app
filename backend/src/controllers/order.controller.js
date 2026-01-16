import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req,res) {
    try {
      const user = req.user;
      const {orderItems,shippingAddress,paymentResult,totalPrice} = req.body;
      
      if(!orderItems || orderItems.length === 0){
          res.status(400).json({ error: "No orders items" });    
        }
        
      for(const item of orderItems){
          const product = await Product.findById(item.product._id);
          if(!product){
            res.status(404).json({ error: `Product ${item.name} not found` });    
        }
        if(product.stock < item.quantity){
            res.status(400).json({ error: `Insufficient stock for ${item.name}` });    
        }
      }

      const order = await Order.create({
        user: user._id,
        clerkId: user.clerkId,
        orderItems,
        shippingAddress,
        paymentResult,
        totalPrice,
      });

      for(const item of orderItems){
        await Product.findByIdAndUpdate(item.product._id,{
            $inc:{ stock: -item.quantity },
        });
    }
    res.status(201).json({ message: "Order created Successfully",order });    
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });    
    }
}
export async function getUsersOrder(req,res) {
    try {
      const orders = await Order.find({clerkId: req.user.clerkId})
      .populate("orderItems.product")
      .sort({createdAt: -1});
      
      const orderswithReviewStatus= await Promise.all(
        orders.map(async (order)=>{
          const review = await Review.findOne({orderId: order._id});
          return {
            ...order.toObject(),
            hasReviewed: !!review,
          };
        })
      );

      res.status(200).json({orders: orderswithReviewStatus});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });    
    }
}