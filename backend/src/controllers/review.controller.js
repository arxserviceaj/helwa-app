import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export async function createReview(req,res) {
    try {
        const {productId,orderId, rating} = req.body;

        if(!rating || rating<1 || rating>5){
            return res.status(400).json({error:"Rating Must be b/w 1 & 5"})
        }
        
        const user = req.user;
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({error:"Order not Found"})
        }
        if(order.clerkId !== user.clerkId){
            return res.status(403).json({error:"Not Authorised to view this order"})
        }
        if(order.clerkId !== "delivered"){
            return res.status(400).json({error:"Can only view Delivered Orders"})
        }
        
        const productInOrder = order.orderItems.find(
            (item) => item.product.toString() === productId.toString()
        )
        if(!productInOrder){
            return res.status(400).json({error:"Product Not Found in this Order"})
        }

        const existingReview = await Review.findOne({productId,userId:user._id});
        if(existingReview){
            return res.status(400).json({error:"You have already reviewed this order"})
        }

        const review = await Review.create({
            productId,
            userId: user._id,
            orderId,
            rating
    })


    const reviews = await Review.find({productId});
    const totalRating = reviews.reduce((sum,rev)=> sum + rev.rating, 0);
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            averageRating: totalRating / reviews.length,
            totalReviews: reviews.length,
        },{
            new:true,
            runValidators: true
        }
    );

    if(!updatedProduct){
        await Review.findByIdAndDelete(reviews._id)
        return res.status(404).json({error:"Product Not Found", })
    }

    return res.status(201).json({message:"Review Submitted Successfully ", review})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error "})
    }
}

export async function deleteReview(req,res) {
    try {
        const {reviewId} = req.params;
        const user = req.user;

        const review = await Review.findById(reviewId);

        if(!review){
            return res.status(404).json({error:"Review not found "})
        }
        
        if(review.userId.toString() !== user._id.toString()){
            return res.status(403).json({error:"Not authorised to delete this review "})
        }

        const productId = review.productId;
        await Review.findByIdAndDelete(reviewId);

        const reviews = await Review.find({productId});
        const totalRating = reviews.reduce((sum,rev)=> sum + rev.rating, 0);
        await Product.findByIdAndUpdate(productId, {
            averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
            totalReviews: reviews.length,
        });


        return res.status(200).json({message:"Review Delete Successfully "})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal Server Error "})
    }
}