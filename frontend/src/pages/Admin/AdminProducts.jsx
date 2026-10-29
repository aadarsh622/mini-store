import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin.service.js';
import { productService } from '../../services/product.service.js';
import { getImageUrl } from '../../services/api.js';
import { toast } from 'sonner';

const createEmptyForm = () => ({
  title: '',
  description: '',
  price: '',
  discountPrice: '',
  brand: '',
  category: '',
  image: '',
  imageMetadata: null,
  stock: '',
  isActive: true,
  featured: false,
  specifications: '',
});

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(createEmptyForm);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts({ limit: 100 });
      setProducts(data.data?.products || []);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data.data || []);
    } catch {
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts();
    loadCategories();
  }, []);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast.error('Please select an image file (PNG, JPG, JPEG, WEBP)');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setUploadingImage(true);
    try {
      const response = await adminService.uploadProductImage(file);
      const imagePath = response.data?.image || response.image;
      if (imagePath) {
        setFormData((prev) => ({
          ...prev,
          image: imagePath,
          imageMetadata: response.data?.imageMetadata || null,
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Failed to get uploaded image path');
      }
    } catch (error) {
      toast.error(error.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: '', imageMetadata: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProductId(null);
    setFormData(createEmptyForm());
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setFormData({
      ...createEmptyForm(),
      title: product.title || '',
      description: product.description || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      brand: product.brand || '',
      category: product.category?._id || product.category || '',
      image: product.image || product.images?.[0] || '',
      imageMetadata: product.imageMetadata || null,
      stock: product.stock ?? '',
      isActive: product.isActive !== false,
      featured: Boolean(product.featured),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image: formData.image.trim(),
        imageMetadata: formData.imageMetadata,
        isActive: formData.isActive,
        featured: formData.featured,
        brand: formData.brand.trim() || undefined,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : undefined,
        stock: Number(formData.stock),
      };

      if (editingProductId) {
        await adminService.updateProduct(editingProductId, payload);
        toast.success('Product updated successfully');
      } else {
        await adminService.createProduct(payload);
        toast.success('Product created successfully');
      }
      closeForm();
      await loadProducts();
    } catch (error) {
      toast.error(error.message || `Failed to ${editingProductId ? 'update' : 'create'} product`);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminService.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <main className="main">
        <section className="page">
          <div
            className="skeletonLine w60"
            style={{ height: '40px', width: '200px', borderRadius: '8px', margin: '0 auto 16px' }}
          />
          <div
            className="skeletonLine w40"
            style={{ height: '16px', width: '100%', borderRadius: '8px', margin: '0 auto 8px' }}
          />
        </section>
      </main>
    );
  }

  return (
    <main className="main">
      <section className="page adminPage">
        <div className="adminHeader">
          <h1 className="pageTitle">Admin Products</h1>
          <button
            type="button"
            className="btn"
            onClick={() => (showForm ? closeForm() : setShowForm(true))}
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {showForm && (
          <motion.form
            className="adminForm"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="formGrid">
              <div className="field">
                <label className="labelText">Product Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="field">
                <label className="labelText">Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label className="labelText">Price (₹) *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </div>

              <div className="field">
                <label className="labelText">Discount Price (₹)</label>
                <input
                  type="number"
                  className="input"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              <div className="field">
                <label className="labelText">Brand</label>
                <input
                  type="text"
                  className="input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="Brand name"
                />
              </div>

              <div className="field">
                <label className="labelText">Stock *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>

              <div className="field fullWidth">
                <label className="labelText">Product Image</label>
                <div className="imageUploadWrap">
                  <div className="imageUploadControls">
                    <label className="fileUploadBtn">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                      />
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      {uploadingImage ? 'Uploading Image...' : 'Choose / Upload Image'}
                    </label>
                    <span className="imageOrText">or enter URL</span>
                    <input
                      type="text"
                      className="input"
                      style={{ flex: 1, minWidth: '220px' }}
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value,
                          imageMetadata: null,
                        })
                      }
                      placeholder="https://example.com/image.png"
                    />
                  </div>

                  {formData.image && (
                    <div className="imagePreviewBox">
                      <img
                        className="imagePreviewImg"
                        src={getImageUrl(formData.image)}
                        alt="Product preview"
                        onError={(e) => {
                          e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';
                        }}
                      />
                      <div className="imagePreviewInfo">
                        <div className="imagePreviewPath">{formData.image}</div>
                        {formData.imageMetadata && (
                          <div className="imagePreviewPath">
                            {formData.imageMetadata.format?.toUpperCase()} ·{' '}
                            {formData.imageMetadata.width} × {formData.imageMetadata.height} ·{' '}
                            {Math.ceil(formData.imageMetadata.bytes / 1024)} KB
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="imageRemoveBtn"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="field fullWidth">
                <label className="labelText">Description *</label>
                <textarea
                  className="textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows="4"
                  required
                />
              </div>

              <div className="field fullWidth">
                <label className="labelText">Specifications (key:value, comma separated)</label>
                <input
                  type="text"
                  className="input"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="Display:6.1 inch, Chip:A17 Pro, Camera:48MP"
                />
              </div>

              <div className="field">
                <label className="labelText">Status</label>
                <select
                  className="input"
                  value={formData.isActive ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.value === 'active' })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="field">
                <label className="labelText">Featured</label>
                <select
                  className="input"
                  value={formData.featured ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.value === 'true' })
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn authSubmit"
              style={{ marginTop: 18 }}
              disabled={uploadingImage || savingProduct}
            >
              {savingProduct
                ? editingProductId
                  ? 'Saving changes...'
                  : 'Creating product...'
                : editingProductId
                  ? 'Save Changes'
                  : 'Create Product'}
            </button>
          </motion.form>
        )}

        <div className="productTableWrap">
          <table className="productTable">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="productTableProduct">
                      <img
                        className="productTableThumb"
                        src={getImageUrl(product.image || product.images?.[0])}
                        alt={product.title}
                        onError={(e) => {
                          e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';
                        }}
                      />
                      <span>{product.title}</span>
                    </div>
                  </td>
                  <td>{product.category?.name || '-'}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`statusBadge ${product.isActive ? 'active' : 'inactive'}`}>
                      {product.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="linkBtn"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="linkBtn danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="emptyState">No products found. Add your first product above.</div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminProducts;
