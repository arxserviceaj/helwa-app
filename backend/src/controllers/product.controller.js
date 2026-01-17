import { Product } from "../models/product.model";

export async function getProductById(req,res) {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);

        if(!product) return res.status(404).json({message:"Product Not Found"});

        res.status(200).json(product);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Product Not Found"});
    }
}