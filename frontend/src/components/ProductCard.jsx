import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useWishlist } from '../hooks/useWishlist.js';
import { getImageUrl } from '../services/api.js';

const round2 = (n) => Math.round(n * 100) / 100;
const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/3081/3081558.png';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const productId = product._id || product.id;
  const title = product.name || product.title || 'Untitled Product';
  const rawImage =
    (Array.isArray(product.images) && product.images[0]) || product.image || FALLBACK_IMAGE;
  const image = getImageUrl(rawImage) || FALLBACK_IMAGE;
  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? product.category.name || ''
      : product.category || '';

  const rate =
    typeof product.rating === 'object' && product.rating !== null
      ? (product.rating.rate ?? 0)
      : Number(product.rating) || 0;
  const count =
    typeof product.rating === 'object' && product.rating !== null
      ? (product.rating.count ?? 0)
      : (product.numReviews ?? 0);

  const validRate = Math.min(5, Math.max(0, Math.round(rate)));
  const stars = '★'.repeat(validRate) + '☆'.repeat(5 - validRate);
  const isLiked = isInWishlist(productId);

  const finalPrice = round2(
    product.discountPrice != null ? product.discountPrice : product.price || 0
  );
  const originalPrice = round2(
    product.price ? (product.discountPrice != null ? product.price : product.price * 1.4) : 0
  );
  const discountPercent =
    product.discountPrice && product.price
      ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
      : 40;

  const handleBuyNow = async () => {
    try {
      const added = await addToCart(product, 1);
      if (added) navigate('/checkout');
    } catch {
      // error already shown by context
    }
  };

  return (
    <article className="productCard">
      <div className="badges">
        <span className="badge badgeNew">New</span>
        <span className="badge badgeHot">Sale</span>
      </div>

      <button
        type="button"
        className={`wishlistBtn ${isLiked ? 'liked' : ''}`}
        onClick={() => toggleWishlist(productId)}
        aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isLiked ? '♥' : '♡'}
      </button>

      <div className="productImageWrap">
        <Link className="productImageLink" to={`/products/${productId}`} aria-label={`View ${title}`}>
          <img
            className="productImage"
            src={image}
            alt={title}
            loading="lazy"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMAGE) {
                e.currentTarget.src = FALLBACK_IMAGE;
              }
            }}
          />
        </Link>
      </div>

      <h3 className="productTitle">
        <Link className="productTitleLink" to={`/products/${productId}`}>
          {title}
        </Link>
      </h3>
      {categoryName && <p className="productCategory">{categoryName}</p>}

      <div className="productRating">
        <span className="stars">{stars}</span>
        <span>{rate ? rate.toFixed(1) : '0.0'}</span>
        <span>({count})</span>
      </div>

      <p className="productPrice">
        ₹{finalPrice.toFixed(2)}
        {originalPrice > finalPrice && (
          <>
            <span className="original">₹{originalPrice.toFixed(2)}</span>
            <span className="discount">-{discountPercent}%</span>
          </>
        )}
      </p>

      <div className="cardActions">
        <button
          type="button"
          className="btn btnGhost"
          onClick={() => addToCart(product)}
        >
          Add to cart
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </article>
  );
};

export default memo(ProductCard);
