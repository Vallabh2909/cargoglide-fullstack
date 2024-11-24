import Order from "../models/order.model.js"; // Import the Mongoose Order model
import Customer from '../models/customer.model.js';
import { uploadToS3 } from "../utils/s3.js";
import User from "../models/user.model.js";
import fs from "fs";

export const createOrder = async (req, res) => {
  try {
    // Input validation
    const { 
      orderId, orderDate, sourceAddress, destinationAddress, 
      products, dimensions, selectedShippingOption 
    } = req.body;

    if (!orderId || !orderDate || !sourceAddress || !destinationAddress || !products || !dimensions || !selectedShippingOption) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products must be a non-empty array.' });
    }

    products.forEach((product, index) => {
      if (!product.name || !product.unitPrice || !product.quantity || !product.category) {
        return res.status(400).json({ error: `Product at index ${index} is missing required fields.` });
      }
      if (product.unitPrice < 0 || product.quantity <= 0) {
        return res.status(400).json({ error: `Invalid unitPrice or quantity for product at index ${index}.` });
      }
    });

    if (dimensions.weight <= 0 || dimensions.length <= 0 || dimensions.width <= 0 || dimensions.height <= 0) {
      return res.status(400).json({ error: 'Invalid dimensions. All values must be greater than 0.' });
    }

    if (selectedShippingOption.price < 0 || selectedShippingOption.rating < 0 || selectedShippingOption.rating > 5) {
      return res.status(400).json({ error: 'Invalid shipping option values.' });
    }

    // Prepare order object
    const order = new Order({
      orderId,
      orderDate,
      sourceAddress,
      destinationAddress,
      products,
      dimensions,
      selectedShippingOption
    });

    // Save order to the database
    const savedOrder = await order.save();

    // Respond with the saved order
    res.status(201).json({ message: 'Order created successfully.', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order.' });
  }
};


export const handleDocUpload = async (req, res) => {
  try {
    // Extract user ID from the request and validate it
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate the uploaded file
    const { file } = req;
    if (!file || !file.filename || !file.path) {
      return res.status(400).json({ error: "File is required for upload" });
    }

    // Find the customer in the database
    const user = await User.findById(userId);
    if (!user ) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Check if the user is a customer
    if (user.role !== "seller") {
      return res.status(404).json({ error: "You are not a Seller" });
    }
    
    const customer = await Customer.findOne({ user: userId });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Upload the file to S3
    const bucketName = "smbhav";
    try {
      await uploadToS3(bucketName, file.filename, file.path);
    } catch (s3Error) {
      console.error("Error uploading file to S3:", s3Error);
      return res.status(500).json({ error: "Failed to upload file to S3" });
    }

    // Update the customer's document reference
    customer.doc = file.filename;
    await customer.save();
    fs.unlinkSync(file.path);

    // Respond with success
    res.status(200).json({
      message: "Document uploaded and updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Error handling document upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserDocuments = async (req, res) => {
  try {
    // Extract user ID from the request and validate it
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find the customer in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is a customer
    if (user.role !== "seller") {
      return res.status(404).json({ error: "You are not a Seller" });
    }

    const customer = await Customer.findOne({ user: userId });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Respond with the customer's document
    res.status(200).json({
      message: "Document retrieved successfully",
      documents: [{
        name: "doc",
        file: customer.doc,
      }]
    });
  } catch (error) {
    console.error("Error getting user documents:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}




