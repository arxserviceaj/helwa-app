import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipcode,
      phoneNumber,
      isDefault,
    } = req.body;

    const user = req.user;

    if(!fullName || !streetAddress || !city || !state || !zipcode ){
      return res.status(400).json({message:"Missing required address fields"});
    }

    if (isDefault) {
      user.addAddress.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipcode,
      phoneNumber,
      isDefault: isDefault || false,
    });

    await user.save();

    res
      .status(201)
      .json({
        message: "Address added successfully",
        addresses: user.addresses,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Addresses failed to add error" });
  }
}

export async function getAddress(req, res) {
  try {
    const user = req.user;

    res.status(200).json({ addresses: user.addresses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Addresses failed to get all error" });
  }
}

export async function updateAddress(req, res) {
  try {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipcode,
      phoneNumber,
      isDefault,
    } = req.body;

    const {addressId} = req.params;

    const user = req.user;
    const address = user.addresses.id(addressId);
    if(!address){
        res.status(404).json({ message: "Addresses not found" });
    }

    if (isDefault) {
      user.addAddress.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    address.label = label || address.label;
    address.fullName = fullName || address.fullName;
    address.streetAddress = streetAddress || address.streetAddress;
    address.city = city ||  address.city;
    address.state = state ||  address.state;
    address.zipcode = zipcode ||  address.zipcode;
    address.phoneNumber = phoneNumber ||  address.phoneNumber;
    address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

    await user.save()

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Addresses failed to update error" });
  }
}

export async function deleteAddress(req, res) {
  try {
    const {addressId} = req.params;
    const user = req.user;
    
    user.addresses.pull(addressId);
    await user.save();
    res.status(200).json({ message: "Addresses delete successfully",addresses: user.addresses });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Addresses failed to delete error" });
  }
}

export async function addToWishlist(req, res) {
  try {
    const {productId} = req.body;
    const user = req.user;
    
    if(!user.wishlist.includes(productId)){
      res.status(400).json({ error: "Product already in whishlist" });
    }
    
    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ error: "Product added to whishlist",wishlist: user.wishlist });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "whishlist failed to add error" });    
  }
}

export async function removeFromWishlist(req, res) {
  try {
    const {productId} = req.params;
    const user = req.user;
    
    if(!user.wishlist.includes(productId)){
      res.status(400).json({ error: "Product not found in whishlist" });
    }
    
    user.wishlist.pull(productId);
    await user.save();
    res.status(200).json({ message: "Product removed from wishlist ",wishlist: user.wishlist });    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });    
  }
}

export async function getWishlist(req, res) { 
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.status(200).json({wishlist: user.wishlist})
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server error" });    
  }
}


