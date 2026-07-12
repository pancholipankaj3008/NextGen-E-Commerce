
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

  const [review, setReview] = useState({ rating: 5, comment: "" });

  const { product, productLoading, relatedProducts } = useAppSelector((state) => state.product);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const wishlistItems = useAppSelector((state) => {
    const value = state.wishlist?.wishlist;
    return Array.isArray(value) ? value : Array.isArray(value?.items) ? value.items : [];
  });

  const reviewState = useAppSelector((state) => state.review || {});
  const reviews = Array.isArray(reviewState.reviews) ? reviewState.reviews : [];

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

  if (productLoading) return <div className="page"><div className="container section">Loading...</div></div>;
  if (!product) return <EmptyState title="Product unavailable" />;

  const currentImage = images[activeImage]?.url || images[activeImage] || "";

  return (
    <main className="page">
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(360px, 0.9fr)", gap: 48 }}>

          {/* Image Gallery */}
          <div style={{ display: "grid", gridTemplateColumns: "82px minmax(0, 1fr)", gap: 14 }}>
            <div style={{ display: "grid", gap: 10 }}>
              {images.map((image, index) => (
                <button key={index} onClick={() => setActiveImage(index)} style={{ border: activeImage === index ? "2px solid var(--ink)" : "1px solid var(--line)", borderRadius: 8, overflow: "hidden" }}>
                  <img src={image?.url || image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>

            <div className="card" style={{ minHeight: 620, position: "relative" }}>
              {currentImage && <img src={currentImage} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
          </div>

          {/* Product Info */}
          <div style={{ position: "sticky", top: 24 }}>
            <span className="eyebrow">{product.collection || product.category}</span>
            <h1 className="title" style={{ marginTop: 10 }}>{product.title}</h1>

            <p className="product-meta">By <strong>{product.brand || "NextGen"}</strong></p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, margin: "16px 0" }}>
              <strong style={{ fontSize: 28 }}>{money(sellingPrice)}</strong>
              {discountPercent > 0 && <span style={{ textDecoration: "line-through", opacity: 0.55 }}>{money(originalPrice)}</span>}
            </div>

            {/* Color */}
            <div className="field" style={{ marginTop: 24 }}>
              <label>Color: <strong>{selectedColor}</strong></label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {(product.variants || []).map((variant) => (
                  <button
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
              <label>Size: <strong>{selectedSize}</strong></label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {(selectedVariant?.sizes || []).map((item) => (
                  <button
                    key={item.size}
                    onClick={() => setSelectedSize(item.size)}
                    disabled={Number(item.stock) < 1}
                    className={selectedSize === item.size ? "btn-primary" : "btn-soft"}
                  >
                    {item.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Buttons */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
              <button className="btn btn-primary" onClick={HandleAddToCart} disabled={!selectedColor || !selectedSize || maxStock < 1}>
                <ShoppingBag size={17} /> Add To Cart
              </button>
              <button className="btn btn-secondary" onClick={HandleWishlist}>
                <Heart fill={isCurrentWishlisted ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </section>
            {/* SERVICE FEATURES */}

            <div
              style={{
                display: "grid",
                gap: 12,
                marginTop: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <Truck size={19} />

                <div>
                  <strong>
                    Fast Delivery
                  </strong>

                  <div className="product-meta">
                    Free shipping on orders above
                    ₹999
                  </div>
                </div>
              </div>


              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <RotateCcw size={19} />

                <div>
                  <strong>
                    Easy Returns
                  </strong>

                  <div className="product-meta">
                    {product.returnPolicy ||
                      "7 Days Easy Return"}
                  </div>
                </div>
              </div>


              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <ShieldCheck size={19} />

                <div>
                  <strong>
                    Secure Purchase
                  </strong>

                  <div className="product-meta">
                    Secure checkout and verified
                    products
                  </div>
                </div>
              </div>
            </div>

          {/* </div> */}
        {/* </div> */}
      {/* </section> */}


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
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "150px 1fr",
                      gap: 14,
                      padding: "13px 0",
                      borderBottom:
                        "1px solid var(--line)",
                    }}
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
                        color === variant.color
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


            <div className="grid grid-4">
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

    </main>
  );
}