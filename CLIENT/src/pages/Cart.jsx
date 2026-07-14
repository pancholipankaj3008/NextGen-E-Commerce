import {
  BadgePercent,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import EmptyState from "../components/EmptyState";

import {
  GetCart,
  UpdateCartQuantity,
  RemoveCartItem,
  ClearCart,
} from "../features/cart/cartThunk";

import {
  ApplyCoupon,
  GetAllCoupons,
} from "../features/coupon/couponThunk";

import {
  RemoveAppliedCoupon,
} from "../features/coupon/couponSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";


const money = (value) =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }
  ).format(Number(value || 0));


const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();


function getSelectedVariant(
  product,
  color
) {
  return product?.variants?.find(
    (variant) =>
      normalize(variant.color) ===
      normalize(color)
  );
}


function getCartItemImage(
  product,
  color
) {
  const selectedVariant =
    getSelectedVariant(
      product,
      color
    );


  return (
    selectedVariant?.images?.[0]?.url ||
    selectedVariant?.images?.[0] ||

    product?.images?.[0]?.url ||
    product?.images?.[0] ||

    product?.variants?.find(
      (variant) =>
        variant.images?.length
    )?.images?.[0]?.url ||

    product?.variants?.find(
      (variant) =>
        variant.images?.length
    )?.images?.[0] ||

    product?.image?.url ||
    product?.image ||

    ""
  );
}


// Best-effort, field-name-agnostic summary of a coupon so this still
// renders sensibly whatever shape the backend coupon documents use.
function describeCoupon(couponItem) {
  const type =
    couponItem.discountType ||
    couponItem.type ||
    "";

  const value =
    couponItem.discountValue ??
    couponItem.discountPercent ??
    couponItem.percentage ??
    couponItem.amount ??
    couponItem.discountAmount ??
    null;

  let headline = "Special offer";

  if (value != null) {
    if (
      normalize(type).includes("percent") ||
      couponItem.discountPercent != null ||
      couponItem.percentage != null
    ) {
      headline = `${value}% OFF`;
    } else {
      headline = `${money(value)} OFF`;
    }
  }

  const minOrder =
    couponItem.minOrderAmount ??
    couponItem.minOrderValue ??
    couponItem.minPurchase ??
    null;

  const sub = minOrder
    ? `On orders above ${money(minOrder)}`
    : couponItem.description || "Tap to apply";

  return { headline, sub };
}


export function Cart() {
  const [coupon, setCoupon] =
    useState("");


  const dispatch =
    useAppDispatch();


  const cartState = useAppSelector(
    (state) => state.cart || {}
  );

  const items = Array.isArray(
    cartState.items
  )
    ? cartState.items
    : Array.isArray(
        cartState.cart?.items
      )
      ? cartState.cart.items
      : [];

  const backendSubtotal =
    Number(cartState.subtotal || 0);

  const loading =
    Boolean(cartState.loading);

  const actionLoading =
    Boolean(cartState.actionLoading);


  const couponState = useAppSelector(
    (state) => state.coupon || {}
  );

  const availableCoupons = Array.isArray(
    couponState.coupons
  )
    ? couponState.coupons
    : [];

  const appliedCoupon =
    couponState.appliedCoupon || null;

  const discountAmount =
    Number(
      couponState.discountAmount || 0
    );

  const finalTotal =
    Number(
      couponState.finalTotal || 0
    );

  const applyLoading =
    Boolean(couponState.applyLoading);

  const couponError =
    couponState.error || null;


  useEffect(() => {
    dispatch(GetCart());
    dispatch(GetAllCoupons());
  }, [dispatch]);


  const subtotal =
    useMemo(() => {
      if (
        Number.isFinite(
          Number(backendSubtotal)
        ) &&
        Number(backendSubtotal) >= 0 &&
        items.length === 0
      ) {
        return Number(
          backendSubtotal
        );
      }


      return items.reduce(
        (total, item) => {
          const product =
            item.product || {};


          const price =
            Number(
              product.finalPrice ??
              item.price ??
              product.price ??
              0
            );


          const quantity =
            Number(
              item.quantity || 1
            );


          return (
            total +
            price * quantity
          );
        },

        0
      );

    }, [
      items,
      backendSubtotal,
    ]);


  const HandleQuantityUpdate =
    async (
      cartItemId,
      quantity
    ) => {
      if (quantity < 1) {
        return;
      }


      dispatch(
        RemoveAppliedCoupon()
      );


      const result =
        await dispatch(
          UpdateCartQuantity({
            cartItemId,
            quantity,
          })
        );


      if (
        UpdateCartQuantity.fulfilled
          .match(result)
      ) {
        dispatch(GetCart());
      }
    };


  const HandleRemoveItem =
    async (cartItemId) => {
      dispatch(
        RemoveAppliedCoupon()
      );


      const result =
        await dispatch(
          RemoveCartItem({
            cartItemId,
          })
        );


      if (
        RemoveCartItem.fulfilled
          .match(result)
      ) {
        dispatch(GetCart());
      }
    };


  const HandleClearCart =
    async () => {
      dispatch(
        RemoveAppliedCoupon()
      );


      const result = await dispatch(
        ClearCart()
      );

      if (
        ClearCart.fulfilled.match(result)
      ) {
        dispatch(GetCart());
      }
    };


  const HandleApplyCode = async (code) => {
    if (!code.trim()) {
      return;
    }

    await dispatch(
      ApplyCoupon({
        code: code.trim().toUpperCase(),
        subtotal,
      })
    );
  };


  const HandleCouponSubmit =
    async (event) => {
      event.preventDefault();
      await HandleApplyCode(coupon);
    };


  const HandleTapCoupon = async (code) => {
    setCoupon(code);
    await HandleApplyCode(code);
  };


  const HandleRemoveCoupon = () => {
    setCoupon("");
    dispatch(RemoveAppliedCoupon());
  };


  if (
    loading &&
    items.length === 0
  ) {
    return (
      <main className="page">
        <div className="container section">
          <div
            className="skeleton"
            style={{
              height: 400,
              borderRadius: 8,
            }}
          />
        </div>
      </main>
    );
  }


  if (items.length === 0) {
    return (
      <main className="page">

        <div className="container section">

          <EmptyState
            icon={
              <ShoppingBag />
            }

            title="Your cart is empty"

            text="Add a few pieces and your checkout summary will appear here."

            action={
              <Link
                className="btn btn-primary"
                to="/products"
              >
                Shop Now
              </Link>
            }
          />

        </div>

      </main>
    );
  }


  return (
    <main className="page cart-page">

      <style>{`
        .cart-page * { box-sizing: border-box; }

        .cart-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 360px;
          gap: 24px;
          align-items: start;
        }

        .cart-summary-aside { position: sticky; top: 24px; }

        .cart-items-list { display: grid; gap: 14px; }

        .cart-item-card {
          display: grid;
          grid-template-columns: auto 1fr auto auto auto;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border: 1px solid var(--line, #e6e2da);
          border-radius: 12px;
        }

        .cart-item-info strong { display: block; }

        .cart-qty-stepper {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid var(--line, #e6e2da);
          border-radius: 8px;
          padding: 4px;
        }

        .cart-coupon-chips {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }
        .cart-coupon-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px 12px;
          border: 1px dashed var(--line, #e6e2da);
          border-radius: 10px;
          background: #faf8f4;
          cursor: pointer;
          text-align: left;
        }
        .cart-coupon-chip.applied {
          border: 1px solid #3f7a4f;
          background: #eaf4ec;
          cursor: default;
        }
        .cart-coupon-chip-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .cart-coupon-code {
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .cart-coupon-meta { display: flex; flex-direction: column; min-width: 0; }
        .cart-coupon-meta span:first-child { font-size: 12.5px; font-weight: 600; }
        .cart-coupon-meta span:last-child {
          font-size: 11px;
          color: var(--ink-soft, #736b58);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cart-coupon-apply-btn {
          flex-shrink: 0;
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--ink, #201d19);
          border-radius: 20px;
          padding: 5px 12px;
        }
        .cart-coupon-applied-tag {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #3f7a4f;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary-aside { position: static; top: auto; }
        }

        @media (max-width: 640px) {
          .cart-item-card {
            grid-template-columns: auto 1fr auto;
            grid-template-areas:
              "img info remove"
              "img qty  price";
            row-gap: 10px;
          }
          .cart-item-card > img,
          .cart-item-card > .skeleton { grid-area: img; }
          .cart-item-card .cart-item-info { grid-area: info; }
          .cart-item-card .cart-item-remove { grid-area: remove; }
          .cart-item-card .cart-item-qty { grid-area: qty; }
          .cart-item-card .cart-item-price { grid-area: price; justify-self: end; }
        }
      `}</style>

      <section className="section-tight">

        <div className="container">

          <span className="eyebrow">
            Checkout bag
          </span>

          <h1 className="title">
            Cart
          </h1>

        </div>

      </section>


      <section
        className="section"
        style={{
          paddingTop: 0,
        }}
      >

        <div
          className="container cart-layout"
        >


          <div className="cart-items-list">

            {items.map((item) => {
              const product =
                item.product || item;


              const cartItemId =
                item._id;


              const qty =
                Number(
                  item.quantity || 1
                );


              const price =
                Number(
                  product.finalPrice ??
                  item.price ??
                  product.price ??
                  0
                );


              const selectedVariant =
                getSelectedVariant(
                  product,
                  item.color
                );


              const selectedSize =
                selectedVariant
                  ?.sizes
                  ?.find(
                    (sizeItem) =>
                      normalize(
                        sizeItem.size
                      ) ===
                      normalize(
                        item.size
                      )
                  );


              const availableStock =
                Number(
                  selectedSize
                    ?.stock || 0
                );


              const image =
                getCartItemImage(
                  product,
                  item.color
                );


              return (
                <div
                  className="cart-item-card"
                  key={
                    cartItemId ||
                    `${product._id}-${item.color}-${item.size}`
                  }
                >

                  {image ? (
                    <img
                      src={image}

                      alt={
                        product.title ||
                        product.name ||
                        "Product"
                      }

                      style={{
                        width: 64,
                        height: 76,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="skeleton"

                      style={{
                        width: 64,
                        height: 76,
                        borderRadius: 8,
                      }}
                    />
                  )}


                  <div className="cart-item-info">

                    <strong>
                      {
                        product.title ||
                        product.name
                      }
                    </strong>


                    <div
                      className="product-meta"

                      style={{
                        marginTop: 5,
                      }}
                    >
                      {
                        [
                          item.color,
                          item.size,
                        ]
                          .filter(Boolean)
                          .join(" / ")
                      }
                    </div>


                    {availableStock > 0 && (
                      <small
                        className="product-meta"
                        style={{
                          display: "block",
                          marginTop: 4,
                        }}
                      >
                        {availableStock} available
                      </small>
                    )}

                    <div style={{ marginTop: 6 }}>
                      {money(price)}
                    </div>

                  </div>


                  <div className="cart-item-qty cart-qty-stepper">

                    <button
                      className="icon-btn"
                      type="button"

                      disabled={
                        actionLoading ||
                        qty <= 1
                      }

                      onClick={() =>
                        HandleQuantityUpdate(
                          cartItemId,
                          qty - 1
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>


                    <strong>
                      {qty}
                    </strong>


                    <button
                      className="icon-btn"
                      type="button"

                      disabled={
                        actionLoading ||
                        availableStock <=
                          qty
                      }

                      onClick={() =>
                        HandleQuantityUpdate(
                          cartItemId,
                          qty + 1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>

                  </div>


                  <strong className="cart-item-price">
                    {money(price * qty)}
                  </strong>


                  <button
                    className="icon-btn cart-item-remove"
                    type="button"

                    disabled={
                      actionLoading
                    }

                    onClick={() =>
                      HandleRemoveItem(
                        cartItemId
                      )
                    }

                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              );
            })}

          </div>


          <aside
            className="card cart-summary-aside"

            style={{
              padding: 22,
              height: "fit-content",
            }}
          >

            <span className="eyebrow">
              Order Summary
            </span>


            <div
              style={{
                display: "grid",
                gap: 12,
                margin: "20px 0",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <span>Subtotal</span>

                <strong>
                  {money(subtotal)}
                </strong>
              </div>


              {appliedCoupon && (
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                  }}
                >
                  <span>
                    Coupon (
                    {
                      appliedCoupon.code
                    }
                    )
                  </span>

                  <strong>
                    -
                    {
                      money(
                        discountAmount
                      )
                    }
                  </strong>
                </div>
              )}


              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <span>Shipping</span>

                <strong>
                  Calculated
                </strong>
              </div>


              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",

                  borderTop:
                    "1px solid var(--line)",

                  paddingTop: 12,
                }}
              >
                <span>Total</span>

                <strong>
                  {
                    money(
                      appliedCoupon
                        ? finalTotal
                        : subtotal
                    )
                  }
                </strong>
              </div>

            </div>


            {/* APPLIED COUPON */}
            {appliedCoupon && (
              <div className="cart-coupon-chip applied" style={{ marginBottom: 16 }}>
                <div className="cart-coupon-chip-left">
                  <BadgePercent size={16} />
                  <div className="cart-coupon-meta">
                    <span>{appliedCoupon.code} applied</span>
                    <span>You saved {money(discountAmount)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={HandleRemoveCoupon}
                  aria-label="Remove coupon"
                >
                  <X size={14} />
                </button>
              </div>
            )}


            {/* AVAILABLE COUPONS */}
            {!appliedCoupon && availableCoupons.length > 0 && (
              <div>
                <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>
                  Available Coupons
                </span>
                <div className="cart-coupon-chips">
                  {availableCoupons.map((couponItem) => {
                    const { headline, sub } = describeCoupon(couponItem);
                    return (
                      <button
                        type="button"
                        key={couponItem._id || couponItem.code}
                        className="cart-coupon-chip"
                        onClick={() => HandleTapCoupon(couponItem.code)}
                        disabled={applyLoading}
                      >
                        <div className="cart-coupon-chip-left">
                          <BadgePercent size={16} />
                          <div className="cart-coupon-meta">
                            <span>
                              <span className="cart-coupon-code">{couponItem.code}</span>
                              {"  "}
                              {headline}
                            </span>
                            <span>{sub}</span>
                          </div>
                        </div>
                        <span className="cart-coupon-apply-btn">Apply</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}


            <form
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
              }}

              onSubmit={
                HandleCouponSubmit
              }
            >

              <input
                className="input"

                value={coupon}

                onChange={(event) =>
                  setCoupon(
                    event.target.value
                  )
                }

                placeholder="Have a coupon code?"
              />


              <button
                className="btn btn-secondary"
                type="submit"

                disabled={
                  applyLoading
                }
              >
                {
                  applyLoading
                    ? "Applying..."
                    : "Apply"
                }
              </button>

            </form>


            {couponError && (
              <small
                className="field-error"

                style={{
                  display: "block",
                  marginTop: -8,
                  marginBottom: 12,
                }}
              >
                {couponError}
              </small>
            )}


            <Link
              className="btn btn-primary"

              style={{
                width: "100%",
              }}

              to="/checkout"
            >
              Checkout
            </Link>


            <button
              className="btn btn-danger"
              type="button"

              style={{
                width: "100%",
                marginTop: 10,
              }}

              disabled={
                actionLoading
              }

              onClick={
                HandleClearCart
              }
            >
              {
                actionLoading
                  ? "Please Wait..."
                  : "Clear Cart"
              }
            </button>

          </aside>

        </div>

      </section>

    </main>
  );
}