import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Truck,
  WashingMachine,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";

import {
  AddToCart,
} from "../features/cart/cartThunk";

import {
  GetRelatedProducts,
  GetSingleProduct,
} from "../features/product/productThunk";

import {
  CreateReview,
  DeleteReview,
  GetProductReviews,
} from "../features/review/reviewThunk";

import {
  AddToWishlist,
  RemoveWishlist,
} from "../features/wishlist/wishlistThunk";

import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export function ProductDetails() {
  const params = useParams();
  const productIdentifier = params.id || params.slug;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [review, setReview] = useState({ rating: 5, comment: "" });




  const { product, productLoading, relatedProducts } = useAppSelector((state) => state.product);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const wishlistItems = useAppSelector((state) => {
    const value = state.wishlist?.wishlist;
    return Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];
  });

  const reviewState = useAppSelector((state) => state.review || {});
  const reviews = Array.isArray(reviewState.reviews) ? reviewState.reviews : [];


  const actionLoading =
    reviewState.loading || false;

  const averageRating = useMemo(() => {

    if (!reviews.length) return 0;

    return (
      reviews.reduce(
        (sum, item) =>
          sum + Number(item.rating || 0),
        0
      ) / reviews.length
    );

  }, [reviews]);

  const ratingDistribution = useMemo(() => {

    const data = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {

      const rating = Number(review.rating);

      if (data[rating] !== undefined) {

        data[rating]++;

      }

    });

    return data;

  }, [reviews]);


  const HandleReviewSubmit = async (e) => {

    e.preventDefault();

    if (!isAuthenticated) {

      navigate("/auth");

      return;

    }

    await dispatch(

      CreateReview({

        productId: product._id,

        rating: review.rating,

        comment: review.comment,

      })

    );

    setReview({

      rating: 5,

      comment: "",

    });

    dispatch(

      GetProductReviews(product._id)

    );

  };


  const HandleDeleteReview = async (reviewId) => {

    await dispatch(

      DeleteReview(reviewId)

    );

    dispatch(

      GetProductReviews(product._id)

    );

  };


  const HandleRelatedCart = (item) => {

    if (!item?.variants?.length) {

      return;

    }

    const variant = item.variants[0];

    const size =
      variant.sizes?.find(
        (s) => Number(s.stock) > 0
      ) || variant.sizes?.[0];

    if (!size) {

      return;

    }

    dispatch(

      AddToCart({

        productId: item._id,

        color: variant.color,

        size: size.size,

        quantity: 1,

      })

    );

  };

  // Selected Variant
  const selectedVariant = useMemo(() => {
    return product?.variants?.find((v) => v.color === selectedColor);
  }, [product, selectedColor]);

  // Images
  const images = useMemo(() => {
    if (selectedVariant?.images?.length > 0) return selectedVariant.images;
    if (product?.images?.length > 0) return product.images;
    return product?.variants?.flatMap((v) => v.images || []) || [];
  }, [product, selectedVariant]);

  const maxStock = useMemo(() => {
    return Number(selectedVariant?.sizes?.find(s => s.size === selectedSize)?.stock || 0);
  }, [selectedVariant, selectedSize]);

  const originalPrice = Number(product?.price || 0);
  const sellingPrice = Number(product?.finalPrice ?? product?.price ?? 0);
  const discountPercent = Number(product?.discountPercent || 0);

  const wishlistIds = useMemo(() => {
    return new Set(wishlistItems.map((item) => String(item.product?._id || item.product || item._id)));
  }, [wishlistItems]);

  const isCurrentWishlisted = wishlistIds.has(String(product?._id));

  // Load Product
  useEffect(() => {
    const LoadProduct = async () => {
      if (!productIdentifier) return;
      const result = await dispatch(GetSingleProduct(productIdentifier));
      if (GetSingleProduct.fulfilled.match(result)) {
        const fetched = result.payload?.product;
        if (fetched?._id) {
          dispatch(GetProductReviews(fetched._id));
          dispatch(GetRelatedProducts(fetched._id));
        }
      }
    };
    LoadProduct();
  }, [dispatch, productIdentifier]);

  // Initial Variant Setup
  useEffect(() => {
    if (!product?.variants?.length) return;

    const firstVariant = product.variants[0];
    setSelectedColor(firstVariant.color || "");

    const firstSize = firstVariant.sizes?.find(s => Number(s.stock) > 0) || firstVariant.sizes?.[0];
    setSelectedSize(firstSize?.size || "");
    setQty(1);
    setActiveImage(0);
  }, [product]);

  const HandleColorChange = (color) => {
    setSelectedColor(color);
    const variant = product.variants?.find(v => v.color === color);
    if (variant?.sizes?.length) {
      const available = variant.sizes.find(s => Number(s.stock) > 0);
      setSelectedSize(available?.size || variant.sizes[0].size);
    }
    setQty(1);
    setActiveImage(0);
  };

  const HandleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/auth");
    if (!selectedColor || !selectedSize || maxStock < 1) return;

    await dispatch(AddToCart({
      productId: product._id,
      quantity: qty,
      size: selectedSize,
      color: selectedColor,
    }));
  };

  const HandleWishlist = async () => {
    if (!isAuthenticated) return navigate("/auth");
    const id = product._id;
    if (wishlistIds.has(String(id))) {
      await dispatch(RemoveWishlist(id));
    } else {
      await dispatch(AddToWishlist(id));
    }
  };

  const HandlePrevImage = () => {
    if (!images.length) return;
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  };

  const HandleNextImage = () => {
    if (!images.length) return;
    setActiveImage((i) => (i + 1) % images.length);
  };

  const HandleQtyDec = () => setQty((q) => Math.max(1, q - 1));
  const HandleQtyInc = () => setQty((q) => Math.min(maxStock || 1, q + 1));

  if (productLoading) return <div className="page"><div className="container section">Loading...</div></div>;
  if (!product) return <EmptyState title="Product unavailable" />;

  const currentImage = images[activeImage]?.url || images[activeImage] || "";
  const canAddToCart = selectedColor && selectedSize && maxStock > 0;

  return (
    <main className="page pd-page">
      <style>{`
        .pd-page { --pd-ink: var(--ink, #201d19); --pd-line: var(--line, #e6e2da); --pd-soft: #6b655c; padding-bottom: 0; }
        .pd-page * { box-sizing: border-box; }

        .pd-top-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(360px, 0.9fr);
          gap: 48px;
        }

        .pd-gallery {
          display: grid;
          grid-template-columns: 82px minmax(0, 1fr);
          gap: 14px;
        }
        .pd-thumb-col {
          display: grid;
          gap: 10px;
          align-content: start;
          max-height: 620px;
          overflow-y: auto;
        }
        .pd-thumb-btn {
          border: 1px solid var(--pd-line);
          border-radius: 8px;
          overflow: hidden;
          padding: 0;
          background: none;
        }
        .pd-thumb-btn.active { border: 2px solid var(--pd-ink); }
        .pd-thumb-btn img { width: 100%; height: 100%; object-fit: cover; display: block; aspect-ratio: 1/1; }

        .pd-main-image {
          max-height: 620px;
          position: relative;
          border-radius: 10px;
          overflow: hidden;
        }
        .pd-main-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .pd-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          cursor: pointer;
          z-index: 2;
        }
        .pd-nav-arrow.left { left: 12px; }
        .pd-nav-arrow.right { right: 12px; }
        .pd-image-counter {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(20,17,14,0.65);
          color: #fff;
          font-size: 11px;
          letter-spacing: 0.04em;
          padding: 4px 10px;
          border-radius: 20px;
          z-index: 2;
        }
        .pd-dots {
          display: none;
          justify-content: center;
          gap: 7px;
          margin-top: 12px;
        }
        .pd-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--pd-line);
          border: none;
          padding: 0;
        }
        .pd-dot.active { background: var(--pd-ink); width: 16px; border-radius: 4px; }

        .pd-info-sticky { position: sticky; top: 24px; }

        .pd-verified-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          letter-spacing: 0.03em;
          color: #3f7a4f;
          background: #eaf4ec;
          padding: 4px 10px;
          border-radius: 20px;
          margin-left: 10px;
          vertical-align: middle;
        }

        .pd-discount-chip {
          display: inline-flex;
          align-items: center;
          font-size: 12.5px;
          font-weight: 600;
          color: #b3543a;
          background: #fbeee9;
          padding: 4px 10px;
          border-radius: 6px;
        }

        .pd-size-row-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .pd-size-guide-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          font-size: 12px;
          letter-spacing: 0.03em;
          text-decoration: underline;
          color: var(--pd-soft);
          cursor: pointer;
          padding: 0;
        }
        .pd-size-guide-card {
          margin-top: 10px;
          padding: 12px 14px;
          border: 1px solid var(--pd-line);
          border-radius: 8px;
          font-size: 12.5px;
          color: var(--pd-soft);
          line-height: 1.6;
          background: #faf8f4;
        }

        .pd-qty-row {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 22px;
          flex-wrap: wrap;
        }
        .pd-qty-label { font-size: 13px; color: var(--pd-soft); }
        .pd-qty-stepper {
          display: flex;
          align-items: center;
          border: 1px solid var(--pd-line);
          border-radius: 8px;
          overflow: hidden;
        }
        .pd-qty-stepper button {
          width: 34px; height: 34px;
          border: none;
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: var(--pd-ink);
        }
        .pd-qty-stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
        .pd-qty-stepper span {
          width: 38px;
          text-align: center;
          font-weight: 600;
          font-size: 13.5px;
        }
        .pd-stock-warning {
          font-size: 12px;
          color: #b3543a;
          font-weight: 600;
        }

        .pd-cta-row {
          margin-top: 20px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 10px;
        }

        .pd-trust-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-top: 28px;
        }
        .pd-trust-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 16px;
          border: 1px solid var(--pd-line);
          border-radius: 10px;
        }

        .pd-spec-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 14px;
          padding: 13px 0;
          border-bottom: 1px solid var(--pd-line);
        }

        .pd-mobile-cta-bar {
          display: none;
        }

        @media (max-width: 900px) {
          .pd-top-grid { grid-template-columns: 1fr; gap: 24px; }
          .pd-gallery { grid-template-columns: 1fr; }
          .pd-thumb-col { display: none; }
          .pd-main-image { min-height: 420px; }
          .pd-dots { display: flex; }
          .pd-info-sticky { position: static; top: auto; }
          .pd-trust-grid { grid-template-columns: 1fr; }
        }
          .pd-related-grid{
    display:grid;
    grid-template-columns:repeat(4,1fr);
    gap:20px;
}

@media(max-width:992px){

.pd-related-grid{

grid-template-columns:repeat(3,1fr);

}

}

@media(max-width:768px){

.pd-related-grid{

grid-template-columns:repeat(2,1fr);

gap:12px;

}

}

        @media (max-width: 640px) {
          .pd-main-image { min-height: 340px; }
          .pd-spec-row { grid-template-columns: 1fr; gap: 4px; padding: 12px 0; }
          .pd-spec-row .product-meta {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.7;
          }

          .pd-page { padding-bottom: 84px; }
          .pd-mobile-cta-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            position: fixed;
            left: 0; right: 0; bottom: 0;
            z-index: 30;
            background: #fff;
            padding: 12px 16px;
            border-top: 1px solid var(--pd-line);
            box-shadow: 0 -4px 16px rgba(0,0,0,0.08);
          }
          .pd-mobile-cta-price { display: flex; flex-direction: column; line-height: 1.2; flex-shrink: 0; }
          .pd-mobile-cta-price strong { font-size: 17px; }
          .pd-mobile-cta-price span { font-size: 10.5px; color: var(--pd-soft); }
          .pd-mobile-cta-bar .btn { flex: 1; }
        }
      `}</style>

      <section className="section">
        <div className="container pd-top-grid">

          {/* Image Gallery */}
          <div className="pd-gallery">
            <div className="pd-thumb-col">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`pd-thumb-btn ${activeImage === index ? "active" : ""}`}
                >
                  <img src={image?.url || image} alt="" />
                </button>
              ))}
            </div>

            <div className="card pd-main-image">
              {images.length > 1 && (
                <span className="pd-image-counter">{activeImage + 1} / {images.length}</span>
              )}
              {images.length > 1 && (
                <button className="pd-nav-arrow left" onClick={HandlePrevImage} aria-label="Previous image">
                  <ChevronLeft size={18} />
                </button>
              )}
              {currentImage && <img src={currentImage} alt={product.title} />}
              {images.length > 1 && (
                <button className="pd-nav-arrow right" onClick={HandleNextImage} aria-label="Next image">
                  <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="pd-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`pd-dot ${activeImage === index ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="pd-info-sticky">
            <span className="eyebrow">{product.collection || product.category}</span>
            <h1 className="title" style={{ marginTop: 10 }}>{product.title}</h1>

            <p className="product-meta">
              By <strong>{product.brand || "NextGen"}</strong>
              <span className="pd-verified-chip"><BadgeCheck size={13} /> Verified Product</span>
            </p>

            {reviews.length >= 0 && (
  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 0 2px" }}>
    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#2f9e44", fontWeight: 700, fontSize: 13.5 }}>
      <Star size={14} fill="#2f9e44" stroke="#2f9e44" />
      {averageRating.toFixed(1)}
    </span>
    <span style={{ color: "var(--pd-soft)", fontSize: 12.5 }}>
      | {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
    </span>
  </div>
)}

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "16px 0", flexWrap: "wrap" }}>
              <strong style={{ fontSize: 28 }}>{money(sellingPrice)}</strong>
              {discountPercent > 0 && (
                <>
                  <span style={{ textDecoration: "line-through", opacity: 0.55 }}>{money(originalPrice)}</span>
                  <span className="pd-discount-chip">{discountPercent}% OFF</span>
                </>
              )}
            </div>

            {/* Color */}
            <div className="field" style={{ marginTop: 24 }}>
              <label>Color: <strong>{selectedColor}</strong></label>
              <div style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 10,
                alignItems: "center"
              }}>
                {(product.variants || []).map((variant) => (
                  <button
                    style={{
                      padding: "10px 18px",
                      minWidth: 70,
                      minHeight: 42,
                      borderRadius: 8,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: 0
                    }}
                    key={variant.color}
                    onClick={() => HandleColorChange(variant.color)}
                    className={selectedColor === variant.color ? "btn-primary" : "btn-soft"}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="field" style={{ marginTop: 18 }}>
              <div className="pd-size-row-head">
                <label>Size: <strong>{selectedSize}</strong></label>
                <button className="pd-size-guide-btn" type="button" onClick={() => setShowSizeGuide((v) => !v)}>
                  <Ruler size={13} /> Size Guide
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {(selectedVariant?.sizes || []).map((item) => (
                  <button
                    style={{
    padding: "10px 18px",
    minWidth: 60,
    minHeight: 42,
    borderRadius: 8,
    border: "1px solid #ddd",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0
}}
                    key={item.size}
                    onClick={() => setSelectedSize(item.size)}
                    disabled={Number(item.stock) < 1}
                    className={selectedSize === item.size ? "btn-primary" : "btn-soft"}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
              {showSizeGuide && (
                <div className="pd-size-guide-card">
                  True to size for most fits. If you're between two sizes, we recommend sizing up for a
                  relaxed fit or sizing down for a snug fit. Check the fabric and fit details above for guidance.
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="pd-qty-row">
              <span className="pd-qty-label">Quantity</span>
              <div className="pd-qty-stepper">
                <button onClick={HandleQtyDec} disabled={qty <= 1} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button onClick={HandleQtyInc} disabled={!maxStock || qty >= maxStock} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              {maxStock > 0 && maxStock <= 5 && (
                <span className="pd-stock-warning">Only {maxStock} left</span>
              )}
              {maxStock < 1 && selectedSize && (
                <span className="pd-stock-warning">Out of stock</span>
              )}
            </div>

            {/* Buttons */}
            <div className="pd-cta-row">
              <button className="btn btn-primary" onClick={HandleAddToCart} disabled={!canAddToCart}>
                <ShoppingBag size={17} /> Add To Cart
              </button>
              <button className="btn btn-secondary" onClick={HandleWishlist}>
                <Heart fill={isCurrentWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust-grid">
              <div className="pd-trust-item">
                <Truck size={19} />
                <div>
                  <strong>Fast Delivery</strong>
                  <div className="product-meta">Free shipping above ₹999</div>
                </div>
              </div>

              <div className="pd-trust-item">
                <RotateCcw size={19} />
                <div>
                  <strong>Easy Returns</strong>
                  <div className="product-meta">{product.returnPolicy || "7 Days Easy Return"}</div>
                </div>
              </div>

              <div className="pd-trust-item">
                <ShieldCheck size={19} />
                <div>
                  <strong>Secure Purchase</strong>
                  <div className="product-meta">Secure checkout, verified products</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* =================================
          DESCRIPTION
      ================================= */}

      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="container">
          <div
            className="card"
            style={{
              padding: 28,
            }}
          >
            <span className="eyebrow">
              Product Story
            </span>

            <h2
              className="title"
              style={{
                marginTop: 8,
              }}
            >
              About this product
            </h2>

            <p
              className="subtitle"
              style={{
                maxWidth: 900,
                lineHeight: 1.8,
              }}
            >
              {product.description}
            </p>
          </div>
        </div>
      </section>


      {/* =================================
          PRODUCT DETAILS
      ================================= */}

      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="container grid grid-2">

          {/* SPECIFICATIONS */}

          <div
            className="card"
            style={{
              padding: 26,
            }}
          >
            <span className="eyebrow">
              Specifications
            </span>

            <h2
              className="title"
              style={{
                fontSize: 28,
                marginTop: 8,
              }}
            >
              Product Details
            </h2>

            <div
              style={{
                display: "grid",
                marginTop: 20,
              }}
            >
              {[
                [
                  "Brand",
                  product.brand || "NextGen",
                ],

                ["Category", product.category],
                ["Sub Category", product.subCategory],
                ["Gender", product.gender],
                ["Fabric", product.attributes?.fabric],
                ["Material", product.attributes?.material],
                ["Fit", product.attributes?.fitType],
                ["Sleeve", product.attributes?.sleeveType],
                ["Neck", product.attributes?.neckType],
                ["Pattern", product.attributes?.pattern],
                ["Occasion", product.attributes?.occasion],
                ["Closure", product.attributes?.closureType],
                ["Waist Rise", product.attributes?.waistRise],
                [
                  "Stretchable",
                  product.attributes?.stretchable === true
                    ? "Yes"
                    : product.attributes?.stretchable === false
                      ? "No"
                      : "",
                ],
                ["Length", product.attributes?.length],
                ["Sole Material", product.attributes?.soleMaterial],
                ["Heel Type", product.attributes?.heelType],
                ["Heel Height", product.attributes?.heelHeight],
                ["Toe Shape", product.attributes?.toeShape],
                ["Collection", product.collection],
                ["SKU", product.sku],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div
                    key={label}
                    className="pd-spec-row"
                  >
                    <span className="product-meta">
                      {label}
                    </span>

                    <strong>{value}</strong>
                  </div>
                ))}
            </div>
          </div>


          {/* CARE AND POLICY */}

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >

            <div
              className="card"
              style={{
                padding: 26,
              }}
            >
              <WashingMachine size={22} />

              <span
                className="eyebrow"
                style={{
                  display: "block",
                  marginTop: 12,
                }}
              >
                Garment Care
              </span>

              <h2
                className="title"
                style={{
                  fontSize: 26,
                  marginTop: 8,
                }}
              >
                Care Instructions
              </h2>

              {product.careInstructions?.length ? (
                <div
                  style={{
                    display: "grid",
                    gap: 10,
                    marginTop: 14,
                  }}
                >
                  {product.careInstructions.map(
                    (instruction, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems:
                            "flex-start",
                        }}
                      >
                        <Sparkles
                          size={15}
                          style={{
                            marginTop: 3,
                          }}
                        />

                        <span>
                          {instruction}
                        </span>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="subtitle">
                  Follow the care label attached to
                  the garment.
                </p>
              )}
            </div>


            <div
              className="card"
              style={{
                padding: 26,
              }}
            >
              <PackageCheck size={22} />

              <span
                className="eyebrow"
                style={{
                  display: "block",
                  marginTop: 12,
                }}
              >
                Purchase Protection
              </span>

              <h2
                className="title"
                style={{
                  fontSize: 26,
                  marginTop: 8,
                }}
              >
                Return Policy
              </h2>

              <p className="subtitle">
                {product.returnPolicy ||
                  "7 Days Easy Return"}
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =================================
          AVAILABLE VARIANTS
      ================================= */}

      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="container">

          <span className="eyebrow">
            Options
          </span>

          <h2
            className="title"
            style={{
              marginTop: 8,
              marginBottom: 22,
            }}
          >
            Available Variants
          </h2>

          <div className="grid grid-3">
            {(product.variants || []).map(
              (variant) => {
                const variantTotalStock =
                  variant.sizes?.reduce(
                    (sum, item) =>
                      sum +
                      Number(item.stock || 0),
                    0
                  ) || 0;

                const variantImage =
                  variant.images?.[0]?.url ||
                  variant.images?.[0] ||
                  "";

                return (
                  <button
                    key={variant.color}
                    type="button"
                    className="card card-hover"
                    onClick={() =>
                      HandleColorChange(
                        variant.color
                      )
                    }
                    style={{
                      padding: 16,
                      textAlign: "left",
                      cursor: "pointer",
                      border:
                        selectedColor === variant.color
                          ? "2px solid var(--ink)"
                          : "1px solid var(--line)",
                    }}
                  >
                    {variantImage && (
                      <img
                        src={variantImage}
                        alt={variant.color}
                        style={{
                          width: "100%",
                          height: 220,
                          objectFit: "cover",
                          borderRadius: 8,
                          marginBottom: 14,
                        }}
                      />
                    )}

                    <strong>
                      {variant.color}
                    </strong>

                    <p className="product-meta">
                      {variant.sizes
                        ?.filter(
                          (item) =>
                            Number(item.stock) > 0
                        )
                        .map(
                          (item) => item.size
                        )
                        .join(", ") ||
                        "No sizes available"}
                    </p>

                    <span className="badge">
                      {variantTotalStock > 0
                        ? `${variantTotalStock} in stock`
                        : "Sold Out"}
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </div>
      </section>


      {/* =================================
          TAGS
      ================================= */}

      {product.tags?.length > 0 && (
        <section
          className="section"
          style={{
            paddingTop: 0,
          }}
        >
          <div className="container">
            <div
              className="card"
              style={{
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <Tag size={18} />

                <span className="eyebrow">
                  Product Tags
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* =================================
          RATINGS AND REVIEWS
      ================================= */}

      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >
        <div className="container">

          <span className="eyebrow">
            Customer Feedback
          </span>

          <h2
            className="title"
            style={{
              marginTop: 8,
              marginBottom: 24,
            }}
          >
            Ratings & Reviews
          </h2>


          <div className="grid grid-2">

            {/* REVIEW SUMMARY */}

            <div
              className="card"
              style={{
                padding: 26,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 24,
                }}
              >
                <div>
                  <strong
                    style={{
                      fontSize: 44,
                      fontFamily:
                        "Cormorant Garamond",
                    }}
                  >
                    {averageRating.toFixed(1)}
                  </strong>

                  <div
                    style={{
                      display: "flex",
                      gap: 3,
                    }}
                  >
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={15}
                          fill={
                            star <=
                              Math.round(
                                averageRating
                              )
                              ? "currentColor"
                              : "none"
                          }
                        />
                      )
                    )}
                  </div>

                  <p className="product-meta">
                    Based on {reviews.length}{" "}
                    reviews
                  </p>
                </div>
              </div>


              <div
                style={{
                  display: "grid",
                  gap: 9,
                }}
              >
                {[5, 4, 3, 2, 1].map(
                  (ratingNumber) => {
                    const count =
                      ratingDistribution[
                      ratingNumber
                      ];

                    const percent =
                      reviews.length > 0
                        ? (count /
                          reviews.length) *
                        100
                        : 0;

                    return (
                      <div
                        key={ratingNumber}
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "35px 1fr 30px",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span>
                          {ratingNumber}★
                        </span>

                        <div
                          style={{
                            height: 7,
                            background:
                              "var(--line)",
                            borderRadius: 20,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${percent}%`,
                              height: "100%",
                              background:
                                "var(--ink)",
                            }}
                          />
                        </div>

                        <span className="product-meta">
                          {count}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>


            {/* WRITE REVIEW */}

            <form
              className="card"
              style={{
                padding: 26,
              }}
              onSubmit={HandleReviewSubmit}
            >
              <span className="eyebrow">
                Share Experience
              </span>

              <h2
                className="title"
                style={{
                  fontSize: 28,
                  marginTop: 8,
                }}
              >
                Write a Review
              </h2>

              <div
                className="field"
                style={{
                  marginTop: 18,
                }}
              >
                <label>Rating</label>

                <select
                  className="select"
                  value={review.rating}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      rating: Number(
                        e.target.value
                      ),
                    })
                  }
                >
                  {[5, 4, 3, 2, 1].map(
                    (number) => (
                      <option
                        key={number}
                        value={number}
                      >
                        {number} Star
                        {number > 1 ? "s" : ""}
                      </option>
                    )
                  )}
                </select>
              </div>


              <div
                className="field"
                style={{
                  marginTop: 14,
                }}
              >
                <label>Your Review</label>

                <textarea
                  className="textarea"
                  rows={5}
                  placeholder="Tell others about the fit, quality and overall experience..."
                  value={review.comment}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      comment:
                        e.target.value,
                    })
                  }
                />
              </div>


              <button
                className="btn btn-primary"
                style={{
                  marginTop: 16,
                }}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Posting..."
                  : "Post Review"}
              </button>
            </form>
          </div>


          {/* REVIEW LIST */}

          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 24,
            }}
          >
            {reviews.length === 0 ? (
              <div
                className="card"
                style={{
                  padding: 26,
                }}
              >
                <p className="subtitle">
                  No reviews yet. Be the first to
                  share your experience.
                </p>
              </div>
            ) : (
              reviews.map((item) => (
                <div
                  key={item._id}
                  className="card"
                  style={{
                    padding: 22,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      gap: 18,
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          flexWrap: "wrap"
                        }}
                      >
                        <strong>
                          {item.user?.name ||
                            "Verified Customer"}
                        </strong>

                        <span className="badge">
                          <Star
                            size={12}
                            fill="currentColor"
                          />

                          {item.rating}/5
                        </span>
                      </div>

                      <p
                        className="subtitle"
                        style={{
                          margin: 0,
                        }}
                      >
                        {item.comment}
                      </p>

                      {item.createdAt && (
                        <p className="product-meta">
                          {new Date(
                            item.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}
                    </div>


                    {(
                      user?.role === "admin" ||
                      item.user?._id ===
                      user?._id ||
                      item.user === user?._id
                    ) && (
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            HandleDeleteReview(
                              item._id
                            )
                          }
                        >
                          Delete
                        </button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>


      {/* =================================
          RELATED PRODUCTS
      ================================= */}

      {relatedProducts?.length > 0 && (
        <section
          className="section"
          style={{
            paddingTop: 0,
          }}
        >
          <div className="container">

            <span className="eyebrow">
              Complete Your Style
            </span>

            <h2
              className="title"
              style={{
                marginTop: 8,
                marginBottom: 24,
              }}
            >
              You may also like
            </h2>


            <div className="pd-related-grid">
              {relatedProducts
                .slice(0, 4)
                .map((item) => (
                  <ProductCard
                    key={
                      item._id ||
                      item.slug
                    }
                    product={item}
                    isWishlisted={
                      wishlistIds.has(
                        String(item._id)
                      )
                    }
                    onWishlist={
                      HandleWishlist
                    }
                    onCart={
                      HandleRelatedCart
                    }
                  />
                ))}
            </div>
          </div>
        </section>
      )}

      {/* MOBILE STICKY ADD-TO-CART BAR */}
      <div className="pd-mobile-cta-bar">
        <div className="pd-mobile-cta-price">
          <strong>{money(sellingPrice)}</strong>
          {discountPercent > 0 && <span>{discountPercent}% OFF</span>}
        </div>
        <button className="btn btn-primary" onClick={HandleAddToCart} disabled={!canAddToCart}>
          <ShoppingBag size={16} /> Add To Cart
        </button>
        <button className="btn btn-secondary" onClick={HandleWishlist} aria-label="Wishlist">
          <Heart fill={isCurrentWishlisted ? "currentColor" : "none"} size={18} />
        </button>
      </div>

    </main>
  );
}