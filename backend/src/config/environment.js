// config/environment.js
// Centralized environment configuration — similar to Java's application.properties / application.yml
require('dotenv').config();
const path = require('path');

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const clientOrigins = parseOrigins(process.env.CLIENT_URL || 'http://localhost:5173');

const environment = {
  // Server
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGO_URI:
    process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/mini_store',

  // Auth / JWT
  JWT_SECRET: process.env.JWT_SECRET || 'replace_with_secure_random_secret_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Bcrypt
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

  // CORS — CLIENT_URL may be a single origin or a comma-separated list
  // (e.g. production Vercel URL + preview URLs)
  CLIENT_URL: clientOrigins[0] || 'http://localhost:5173',
  CLIENT_ORIGINS: clientOrigins,

  // Public API base URL used for payment gateway callbacks (Render URL)
  API_PUBLIC_URL:
    process.env.API_PUBLIC_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${process.env.PORT || 5000}`,

  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  MAIL_FROM: process.env.MAIL_FROM || 'Mini Store <onboarding@resend.dev>',

  // Uploads — UPLOAD_DIR is the display/relative name; UPLOAD_PATH is the
  // absolute, cwd-independent path actually used by multer/static serving.
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  UPLOAD_PATH: path.join(__dirname, '..', '..', process.env.UPLOAD_DIR || 'uploads'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,

  // Cloudinary stores uploaded product images outside the application filesystem.
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};

if (
  !environment.MONGO_URI ||
  /YOUR_CLUSTER|YOUR_USERNAME|YOUR_PASSWORD/.test(environment.MONGO_URI)
) {
  console.error(
    'ERROR: MONGO_URI is not configured. Set a valid MongoDB connection string in your environment variables.'
  );
  process.exit(1);
}

if (
  environment.NODE_ENV === 'production' &&
  (!process.env.JWT_SECRET ||
    process.env.JWT_SECRET.includes('replace_with_secure_random_secret_in_production'))
) {
  console.error('ERROR: JWT_SECRET must be set to a secure random value in production.');
  process.exit(1);
}

if (
  environment.NODE_ENV === 'production' &&
  (!environment.CLOUDINARY_CLOUD_NAME ||
    !environment.CLOUDINARY_API_KEY ||
    !environment.CLOUDINARY_API_SECRET)
) {
  console.error(
    'ERROR: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET must be set in production for persistent product image uploads.'
  );
  process.exit(1);
}

module.exports = environment;
