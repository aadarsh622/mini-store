// repositories/orderRepository.js
// Repository — data-access calls against the Order collection
const Order = require('../models/Order');

const create = (orderData) => Order.create(orderData);

const findById = (id) => Order.findById(id).populate('user', 'name email');

const findByUser = (userId, { skip = 0, limit = 20 } = {}) =>
  Order.find({ user: userId }).sort({ createdAt: -1 }).skip(Number(skip)).limit(Number(limit));

const findAll = ({ filter = {}, skip = 0, limit = 20 } = {}) =>
  Order.find(filter)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit));

const count = (filter = {}) => Order.countDocuments(filter);

const updateStatus = (id, status) =>
  Order.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).populate(
    'user',
    'name email'
  );

const updatePaymentStatus = (id, paymentStatus) =>
  Order.findByIdAndUpdate(id, { paymentStatus }, { new: true, runValidators: true });

module.exports = {
  create,
  findById,
  findByUser,
  findAll,
  count,
  updateStatus,
  updatePaymentStatus,
};
