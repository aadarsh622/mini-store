// controllers/productController.js
// Controller — product catalog CRUD + listing/search/filter endpoints.
// Category management is folded in here (rather than a separate controller)
// since categories only exist to support the product catalog.
const productService = require('../services/productService');
const imageStorageService = require('../services/imageStorageService');
const categoryRepository = require('../repositories/categoryRepository');
const AppError = require('../utils/AppError');
const response = require('../utils/response');

const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    return response.created(res, { message: 'Product created', data: product });
  } catch (err) {
    next(err);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const { page, limit, category, minPrice, maxPrice, search } = req.query;
    const result = await productService.listProducts({
      page,
      limit,
      category,
      minPrice,
      maxPrice,
      search,
    });
    return response.success(res, { data: result });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return response.success(res, { data: product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return response.success(res, { message: 'Product updated', data: product });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id);
    return response.success(res, { message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryId);
    return response.success(res, { data: products });
  } catch (err) {
    next(err);
  }
};

const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return response.error(res, { message: 'No file uploaded', statusCode: 400 });
    }
    const image = await imageStorageService.uploadProductImage(req.file);
    return response.success(res, { message: 'Image uploaded', data: image });
  } catch (err) {
    next(err);
  }
};

// --- Category management (admin) ---

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name)
      return response.error(res, { message: 'Category name is required', statusCode: 400 });

    const existing = await categoryRepository.findByName(name);
    if (existing) throw new AppError('Category already exists', 409);

    const category = await categoryRepository.create({ name, description, image });
    return response.created(res, { message: 'Category created', data: category });
  } catch (err) {
    next(err);
  }
};

const listCategories = async (req, res, next) => {
  try {
    const categories = await categoryRepository.findAll({ isActive: true });
    return response.success(res, { data: categories });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await categoryRepository.updateById(req.params.id, req.body);
    if (!category) throw new AppError('Category not found', 404);
    return response.success(res, { message: 'Category updated', data: category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryRepository.deleteById(req.params.id);
    if (!category) throw new AppError('Category not found', 404);
    return response.success(res, { message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  uploadProductImage,
  createCategory,
  listCategories,
  updateCategory,
  deleteCategory,
};
