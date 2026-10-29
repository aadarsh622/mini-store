// services/authService.js
// Service — business logic layer, like a Java @Service class
const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('./emailService');
const environment = require('../config/environment');

const register = async ({ name, email, password, phone, address }) => {
  const existing = await userRepository.existsByEmail(email);
  if (existing) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
  });

  const token = generateToken({ id: user._id });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated', 403);
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken({ id: user._id });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { user: safeUser, token };
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findByIdWithPassword(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return { message: 'Password updated successfully' };
};

const requestPasswordReset = async (email) => {
  const user = await userRepository.findByEmailWithPassword(email);
  if (!user) return null;

  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${environment.CLIENT_URL}/reset-password/${token}`;
  await sendPasswordResetEmail({ email: user.email, resetUrl });
  return { token, resetUrl };
};

const validatePasswordResetToken = async (token) => {
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const User = require('../models/User');
  return User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  }).select('_id');
};

const resetPassword = async (token, password) => {
  if (!password || password.length < 6)
    throw new AppError('Password must be at least 6 characters', 400);
  const user = await validatePasswordResetToken(token);
  if (!user) throw new AppError('Password reset token is invalid or has expired', 400);
  user.password = await hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
};

module.exports = {
  register,
  login,
  changePassword,
  requestPasswordReset,
  validatePasswordResetToken,
  resetPassword,
};
