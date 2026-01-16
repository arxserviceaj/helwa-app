import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createOrder(req,res) {
  const session = await Product.startSession();
  session.startTransaction();
    try {
      const user = req.user;
      const {orderItems,shippingAddress,paymentResult,totalPrice} = req.body;
      
      if(!orderItems || orderItems.length === 0){
          res.status(400).json({ error: "No orders items" });    
        }
        
      for(const item of orderItems){
          const product = await Product.findById(item.product).session(session);
          if(!product){
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ error: `Product ${item.name} not found` });    
        }
        if(product.stock < item.quantity){
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ error: `Insufficient stock for ${item.name}` });    
        }
      }

      const order = await Order.create(
        [

          {
            user: user._id,
            clerkId: user.clerkId,
            orderItems,
            shippingAddress,
            paymentResult,
            totalPrice,
          }
        ],{
          session
        }
      );

      

      for(const item of orderItems){
        await Product.findByIdAndUpdate(item.product,{
            $inc:{ stock: -item.quantity },
        },{session});
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ message: "Order created Successfully",order });    
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });    
    }
}
export async function getUsersOrder(req,res) {
    try {
      const orders = await Order.find({clerkId: req.user.clerkId})
      .populate("orderItems.product")
      .sort({createdAt: -1});

      const orderIds = orders.map(order=> order._id);
      const reviews = await Review.find({orderId:{$in:orderIds}});
      const reviewedOrderIds = new Set(reviews.map(review=> review.orderId.toString()));

      const orderswithReviewStatus= await Promise.all(
        orders.map(async (order)=>{
          return {
            ...order.toObject(),
            hasReviewed: reviewedOrderIds.has(order._id.toString()),
          };
        })
      );

      res.status(200).json({orders: orderswithReviewStatus});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server error" });    
    }
}