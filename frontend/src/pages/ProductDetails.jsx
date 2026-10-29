import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { getImageUrl } from '../services/api.js';
import { productService } from '../services/product.service.js';

const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await productService.getProduct(id);
        if (active) {
          const item = response.data;
          setProduct(item);
          setImage(getImageUrl(item.image || item.images?.[0]) || FALLBACK_IMAGE);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Unable to load this product.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product);
  };

  if (loading) {
    return (
      <main className="main">
        <section className="page productDetailsPage">
          <div className="status">Loading product...</div>
        </section>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="main">
        <section className="page productDetailsPage">
          <div className="status error">{error || 'Product not found.'}</div>
          <Link className="btn productDetailsBack" to="/">
            Back to products
          </Link>
        </section>
      </main>
    );
  }

  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name
      : product.category;

  return (
    <main className="main">
      <section className="page productDetailsPage">
        <Link className="productDetailsBackLink" to="/">
          ← Back to products
        </Link>
        <article className="productDetails">
          <div className="productDetailsImageWrap">
            <img
              className="productDetailsImage"
              src={image}
              alt={product.title || 'Product'}
              onError={() => setImage(FALLBACK_IMAGE)}
            />
          </div>
          <div className="productDetailsInfo">
            {categoryName && <p className="productCategory">{categoryName}</p>}
            <h1 className="pageTitle">{product.title}</h1>
            {product.brand && <p className="productDetailsBrand">{product.brand}</p>}
            <p className="productDetailsPrice">₹{Number(product.price || 0).toFixed(2)}</p>
            <p className="productDetailsDescription">
              {product.description || 'No description available.'}
            </p>
            <p className="productDetailsStock">
              {product.stock > 0 ? `${product.stock} in stock` : 'Currently out of stock'}
            </p>
            <button
              type="button"
              className="btn productDetailsAdd"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to cart
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}

export default ProductDetails;
