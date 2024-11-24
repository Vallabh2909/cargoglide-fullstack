const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  unitPrice: Number,
  quantity: Number,
  category: String,
});

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  county: String,
  country: String,
  state: String,
  pincode: String,
});

const orderSchema = new mongoose.Schema({
  orderId: String,
  orderDate: Date,
  exportReason: String,
  sourceAddress: addressSchema,
  destinationAddress: addressSchema,
  products: [productSchema],
});

// Prevent overwriting the model if it already exists
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;
