// routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

const router = express.Router();

// User endpoints
router.post('/', protect, orderController.placeOrder);
router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/:id', protect, orderController.getOrderById);
router.delete('/:id', protect, orderController.cancelOrder);

// Admin endpoints
router.get('/', protect, adminOnly, orderController.listAllOrders);
router.put('/:id/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
