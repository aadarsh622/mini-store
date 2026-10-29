// routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const environment = require('../config/environment');
const AppError = require('../utils/AppError');

const router = express.Router();

const ALLOWED_EXT = /^\.(jpe?g|png|webp)$/i;
const ALLOWED_MIME = /^image\/(jpeg|png|webp)$/;

const fileFilter = (req, file, cb) => {
  const isValid =
    ALLOWED_EXT.test(path.extname(file.originalname)) && ALLOWED_MIME.test(file.mimetype);
  if (!isValid) {
    // Pass an AppError (has statusCode) rather than a plain Error, so
    // errorMiddleware returns a clean 400 instead of a generic 500.
    return cb(new AppError('Only image files (jpg, jpeg, png, webp) are allowed', 400));
  }
  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: environment.MAX_FILE_SIZE_MB * 1024 * 1024 },
});

// --- Category routes (folded in here — categories only support the catalog) ---
router.get('/categories', productController.listCategories);
router.post('/categories', protect, adminOnly, productController.createCategory);
router.put('/categories/:id', protect, adminOnly, productController.updateCategory);
router.delete('/categories/:id', protect, adminOnly, productController.deleteCategory);
router.get('/category/:categoryId', productController.getProductsByCategory);

// --- Product routes ---
router.get('/', productController.listProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, adminOnly, productController.createProduct);
router.put('/:id', protect, adminOnly, productController.updateProduct);
router.delete('/:id', protect, adminOnly, productController.deleteProduct);
router.post(
  '/upload-image',
  protect,
  adminOnly,
  upload.single('image'),
  productController.uploadProductImage
);

module.exports = router;
