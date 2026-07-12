import {
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import { normalizeProduct } from "../utils/product";


const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));


export default function ProductCard({
  product,
  onCart,
  onWishlist,
  isWishlisted = false,
}) {
  const item = normalizeProduct(product);


  // =====================================
  // PRODUCT IMAGE
  // =====================================

  const image =
    item.image ||
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.variants?.find(
      (variant) => variant.images?.length
    )?.images?.[0]?.url ||
    product.variants?.find(
      (variant) => variant.images?.length
    )?.images?.[0] ||
    "";


  // =====================================
  // PRODUCT ROUTE
  // =====================================

  const productPath = `/product/${
    product.slug ||
    product._id ||
    product.id
  }`;


  // =====================================
  // PRICE
  // =====================================

  const originalPrice = Number(
    product.price ||
    item.price ||
    0
  );

  const displayPrice = Number(
    product.finalPrice ??
    item.price ??
    product.price ??
    0
  );

  const discountPercent = Number(
    product.discountPercent || 0
  );


  // =====================================
  // STOCK
  // =====================================

  const totalStock =
    product.totalStock ??
    product.variants?.reduce(
      (variantTotal, variant) => {
        const sizeTotal =
          (variant.sizes || []).reduce(
            (total, sizeItem) =>
              total +
              Number(sizeItem.stock || 0),
            0
          );

        return variantTotal + sizeTotal;
      },
      0
    ) ??
    0;


  // =====================================
  // RATING
  // =====================================

  const rating = Number(
    product.ratings || 0
  );


  return (
    <article className="card card-hover product-card">

      {/* IMAGE */}

      <Link to={productPath}>
        <div
          className="product-media"
          style={{
            position: "relative",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={item.name || product.title}
            />
          ) : (
            <div
              className="skeleton"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}


          {/* PRODUCT BADGES */}

          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {product.isNewArrival && (
              <span className="badge">
                New
              </span>
            )}

            {product.isTrending && (
              <span className="badge">
                Trending
              </span>
            )}

            {discountPercent > 0 && (
              <span className="badge">
                {discountPercent}% OFF
              </span>
            )}

            {totalStock <= 0 && (
              <span className="badge">
                Sold Out
              </span>
            )}
          </div>
        </div>
      </Link>


      {/* BODY */}

      <div className="product-body">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>

            {/* BRAND */}

            {product.brand && (
              <div
                className="product-meta"
                style={{
                  marginBottom: 4,
                }}
              >
                {product.brand}
              </div>
            )}


            {/* NAME */}

            <Link
              to={productPath}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <h3 className="product-name">
                {item.name || product.title}
              </h3>
            </Link>


            {/* META */}

            <div className="product-meta">
              {[
                item.category ||
                  product.category,

                product.subCategory,

                item.gender ||
                  product.gender,

              ]
                .filter(Boolean)
                .join(" / ")}
            </div>


            {/* RATING */}

            {rating > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 7,
                }}
              >
                <Star
                  size={13}
                  fill="currentColor"
                />

                <span className="product-meta">
                  {rating.toFixed(1)}

                  {product.numReviews > 0 &&
                    ` (${product.numReviews})`}
                </span>
              </div>
            )}
          </div>


          {/* WISHLIST */}

          <button
            className="icon-btn"
            type="button"
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            onClick={() =>
              onWishlist?.(product)
            }
            style={
              isWishlisted
                ? {
                    color: "#b8554a",
                  }
                : undefined
            }
          >
            <Heart
              size={16}
              fill={
                isWishlisted
                  ? "currentColor"
                  : "none"
              }
            />
          </button>
        </div>


        {/* PRICE + CART */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: 12,
          }}
        >
          <div>
            <div className="price">
              {money(displayPrice)}
            </div>

            {discountPercent > 0 &&
              originalPrice >
                displayPrice && (
                <div
                  className="product-meta"
                  style={{
                    textDecoration:
                      "line-through",
                    marginTop: 2,
                  }}
                >
                  {money(originalPrice)}
                </div>
              )}
          </div>


          <button
            className="btn btn-secondary"
            type="button"
            disabled={totalStock <= 0}
            onClick={() =>
              onCart?.(product)
            }
          >
            <ShoppingBag size={15} />

            {totalStock > 0
              ? "Add"
              : "Sold Out"}
          </button>
        </div>
      </div>
    </article>
  );
}