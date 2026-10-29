// services/orderService.js
// Service — business logic for placing and managing orders
const orderRepository = require('../repositories/orderRepository');
const Order = require('../models/Order');
const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');
const AppError = require('../utils/AppError');

/**
 * Checkout: turns the user's current cart into an Order,
 * decrements stock for each product, and clears the cart.
 */
const placeOrder = async (userId, { shippingAddress, paymentMethod = 'cod' }) => {
  const cart = await cartRepository.findByUser(userId);

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      throw new AppError(`Product no longer available`, 400);
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.title}`, 400);
    }

    orderItems.push({
      product: product._id,
      title: product.title,
      image: product.image,
      price: item.priceAtAddTime,
      quantity: item.quantity,
    });

    totalAmount += item.priceAtAddTime * item.quantity;
  }

  // Reserve stock for each item
  for (const item of orderItems) {
    const updated = await productRepository.decrementStock(item.product, item.quantity);
    if (!updated) {
      throw new AppError(`Insufficient stock for ${item.title}`, 400);
    }
  }

  const order = await orderRepository.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  cart.items = [];
  await cartRepository.save(cart);

  return order;
};

const getOrderById = async (orderId, requester) => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  const isOwner = order.user._id.toString() === requester.id;
  if (!isOwner && requester.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  return order;
};

const getMyOrders = async (userId, { page = 1, limit = 20 } = {}) => {
  // page/limit arrive as strings from req.query — coerce to safe integers
  // before doing arithmetic or handing them to Mongoose's skip()/limit().
  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 20, 1);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    orderRepository.findByUser(userId, { skip, limit: limitNum }),
    orderRepository.count({ user: userId }),
  ]);
  return { orders, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

const listAllOrders = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  const validStatuses = Order.schema.path('status').enumValues;
  if (status !== undefined) {
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid order status filter', 400);
    }
    filter.status = status;
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  if (!Number.isSafeInteger(pageNum) || pageNum < 1) {
    throw new AppError('Page must be a positive integer', 400);
  }
  if (!Number.isSafeInteger(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new AppError('Limit must be an integer between 1 and 100', 400);
  }
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    orderRepository.findAll({ filter, skip, limit: limitNum }),
    orderRepository.count(filter),
  ]);
  return { orders, total, page: pageNum, pages: Math.ceil(total / limitNum) };
};

const updateOrderStatus = async (orderId, status) => {
  const validStatuses = Order.schema.path('status').enumValues;
  if (typeof status !== 'string' || !validStatuses.includes(status)) {
    throw new AppError('Invalid order status', 400);
  }

  const order = await orderRepository.updateStatus(orderId, status);
  if (!order) throw new AppError('Order not found', 404);
  return order;
};

/**
 * Cancel an order. Only the owner may cancel, and only if it hasn't
 * shipped or been delivered yet. Stock is restored for every item.
 */
const cancelOrder = async (orderId, requester) => {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  const isOwner = order.user._id.toString() === requester.id;
  if (!isOwner && requester.role !== 'admin') {
    throw new AppError('Not authorized to cancel this order', 403);
  }

  if (['shipped', 'delivered'].includes(order.status)) {
    throw new AppError('Cannot cancel an order that has already shipped or been delivered', 400);
  }

  if (order.status === 'cancelled') {
    throw new AppError('Order is already cancelled', 400);
  }

  // Restore stock for every item
  for (const item of order.items) {
    await productRepository.incrementStock(item.product, item.quantity);
  }

  order.status = 'cancelled';
  order.paymentStatus = 'cancelled';
  await order.save();

  return order;
};

module.exports = {
  placeOrder,
  getOrderById,
  getMyOrders,
  listAllOrders,
  updateOrderStatus,
  cancelOrder,
};
