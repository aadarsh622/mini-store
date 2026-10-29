// controllers/orderController.js
// Controller — checkout + order history + admin order management
const orderService = require('../services/orderService');
const response = require('../utils/response');

const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress) {
      return response.error(res, { message: 'shippingAddress is required', statusCode: 400 });
    }

    const order = await orderService.placeOrder(req.user.id, { shippingAddress, paymentMethod });
    return response.created(res, { message: 'Order placed successfully', data: order });
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await orderService.getMyOrders(req.user.id, { page, limit });
    return response.success(res, { data: result });
  } catch (err) {
    next(err);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    return response.success(res, { data: order });
  } catch (err) {
    next(err);
  }
};

// --- Admin endpoints ---

const listAllOrders = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const result = await orderService.listAllOrders({ page, limit, status });
    return response.success(res, { data: result });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const status = req.body?.status;
    if (typeof status !== 'string') {
      return response.error(res, { message: 'A valid order status is required', statusCode: 400 });
    }

    const order = await orderService.updateOrderStatus(req.params.id, status);
    return response.success(res, { message: 'Order status updated', data: order });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/orders/:id — cancel an order (owner or admin).
 * Stock is restored and status set to cancelled.
 */
const cancelOrder = async (req, res, next) => {
  try {
    const order = await orderService.cancelOrder(req.params.id, req.user);
    return response.success(res, { message: 'Order cancelled successfully', data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  listAllOrders,
  updateOrderStatus,
  cancelOrder,
};
