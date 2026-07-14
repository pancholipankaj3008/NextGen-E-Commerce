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

  const productPath = `/product/${product.slug ||
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
    
    <article
      className="card card-hover product-card"
      style={{
        padding: 0,
        overflow: "hidden",
        borderRadius: 12,
      }}
    >
      {/* IMAGE */}

      <Link to={productPath}>
        <div
  className="product-media"
  style={{
    position: "relative",
    width: "100%",
    aspectRatio: "3/4",
    overflow: "hidden",
    background: "#f5f5f5",
    borderRadius: "12px 12px 0 0",
  }}
>
          {image ? (
            <img
  src={image}
  alt={item.name || product.title}
  style={{
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
  }}
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

            {/* {discountPercent > 0 && (
              <span className="badge">
                {discountPercent}% OFF
              </span>
            )} */}

            {totalStock <= 0 && (
              <span className="badge">
                Sold Out
              </span>
            )}
          </div>
          <button
            className="icon-btn"
            onClick={() => onWishlist?.(product)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,.15)",
              color: isWishlisted ? "#e53935" : "#222"
            }}
          >
            <Heart
              size={17}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
{rating >= 0 && (

          <div
            style={{
              position: "absolute",
              left: 10,
              bottom: 10,
              background: "#fff",
              padding: "4px 8px",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              fontWeight: 600
            }}
          >

            <Star
              size={12}
              fill="green"
              color="green"
            />

            {rating.toFixed(1)}

            {product.numReviews &&
              ` | ${product.numReviews}`}

          </div>

        )}

        </div>

        

      </Link>


      {/* BODY */}

      <div className="product-body">

        <div
          className="product-body"
          style={{
            padding: "10px"
          }}
        >
          <div style={{ minWidth: 0 }}>

            {/* BRAND */}

            {product.brand && (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#8e24aa"
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
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: "20px",
                  height: 40,
                  overflow: "hidden",
                  margin: "4px 0"
                }}
              >
                {item.name || product.title}
              </h3>
            </Link>


            {/* META */}

            {/* <div className="product-meta">
              {[
                item.category ||
                  product.category,

                product.subCategory,

                item.gender ||
                  product.gender,

              ]
                .filter(Boolean)
                .join(" / ")}
            </div> */}



          </div>


          {/* WISHLIST

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
          </button> */}
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
            <div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap"
                }}
              >

                <span
                  style={{
                    color: "green",
                    fontWeight: 700,
                    fontSize: 14
                  }}
                >

                  ↓{discountPercent}%

                </span>

                <span
                  style={{
                    textDecoration: "line-through",
                    fontSize: 13,
                    color: "#777"
                  }}
                >

                  {money(originalPrice)}

                </span>

                <strong
                  style={{
                    fontSize: 19
                  }}
                >

                  {money(displayPrice)}


                </strong>


              </div>
              <span
style={{
display:"inline-block",
background:"#d7ffd7",
color:"green",
padding:"2px 6px",
borderRadius:4,
fontSize:11,
fontWeight:600,
marginTop:4
}}
>

Hot Deal

</span>
<div
style={{
fontSize:12,
color:"#555",
marginTop:6
}}
>

Delivery by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short"
})}

</div>

            </div>


          </div>


         
        </div>
      </div>
    </article>
  );
}