import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';  // Assuming you have a dbConnect function
import Order from '../../../models/Order'; // Importing the model

// Handle POST requests to create a new order
export async function POST(req) {
  try {
    const { orderId, orderDate, exportReason, sourceAddress, destinationAddress, products } = await req.json();

    // Connect to the database
    await dbConnect();

    // Create a new order using the Mongoose model
    const newOrder = new Order({
      orderId,
      orderDate,
      exportReason,
      sourceAddress,
      destinationAddress,
      products,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    // Respond with success
    return NextResponse.json({
      message: 'Order created successfully!',
      orderId: savedOrder._id,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating order', error: error.message }, { status: 500 });
  }
}

// Handle GET requests to fetch all orders
export async function GET(req) {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Respond with the orders
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
  }
}
