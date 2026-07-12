import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
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


  const HandleCouponSubmit =
    async (event) => {
      event.preventDefault();


      if (!coupon.trim()) {
        return;
      }


      await dispatch(
        ApplyCoupon({
          code:
            coupon
              .trim()
              .toUpperCase(),

          subtotal,
        })
      );
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
    <main className="page">

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
          className="container"
          style={{
            display: "grid",

            gridTemplateColumns:
              "minmax(0, 1fr) 360px",

            gap: 24,
          }}
        >


          <div className="table-wrap">

            <table className="table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>


              <tbody>

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
                    <tr
                      key={
                        cartItemId ||
                        `${product._id}-${item.color}-${item.size}`
                      }
                    >

                      <td>

                        <div
                          style={{
                            display: "flex",
                            gap: 12,
                            alignItems:
                              "center",
                          }}
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
                                objectFit:
                                  "cover",
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


                          <div>

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
                                  .filter(
                                    Boolean
                                  )
                                  .join(" / ")
                              }
                            </div>


                            {availableStock > 0 && (
                              <small
                                className="product-meta"
                                style={{
                                  display:
                                    "block",

                                  marginTop: 4,
                                }}
                              >
                                {
                                  availableStock
                                }{" "}
                                available
                              </small>
                            )}

                          </div>

                        </div>

                      </td>


                      <td>
                        {money(price)}
                      </td>


                      <td>

                        <div
                          style={{
                            display: "flex",
                            alignItems:
                              "center",
                            gap: 8,
                          }}
                        >

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

                      </td>


                      <td>
                        {
                          money(
                            price * qty
                          )
                        }
                      </td>


                      <td>

                        <button
                          className="icon-btn"
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

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>


          <aside
            className="card"

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

                placeholder="Coupon"
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