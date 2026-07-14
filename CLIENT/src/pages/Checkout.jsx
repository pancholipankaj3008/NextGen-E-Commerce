import {
  BadgePercent,
  CreditCard,
  MapPin,
  PackageCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  GetCart,
} from "../features/cart/cartThunk";

import {
  ResetCart,
} from "../features/cart/cartSlice";

import {
  CreateOrder,
} from "../features/order/orderThunk";

import {
  GetProfile,
} from "../features/auth/authThunk";

import {
  AddAddress,
} from "../features/address/addressThunk";

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


const emptyAddress = {
  type: "Home",
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  area: "",
  houseNo: "",
  landmark: "",
};


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


function getVariant(
  product,
  color
) {
  return product?.variants?.find(
    (variant) =>
      normalize(variant.color) ===
      normalize(color)
  );
}


function getItemImage(
  product,
  color
) {
  const variant =
    getVariant(
      product,
      color
    );


  return (
    variant?.images?.[0]?.url ||
    variant?.images?.[0] ||

    product?.images?.[0]?.url ||
    product?.images?.[0] ||

    product?.variants?.find(
      (item) =>
        item.images?.length
    )?.images?.[0]?.url ||

    product?.variants?.find(
      (item) =>
        item.images?.length
    )?.images?.[0] ||

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


export function Checkout() {
  const [step, setStep] =
    useState(0);


  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("COD");


  const [
    addressId,
    setAddressId,
  ] = useState("");


  const [
    manualAddress,
    setManualAddress,
  ] = useState(emptyAddress);


  const [couponCode, setCouponCode] =
    useState("");

  const [addressError, setAddressError] = useState("");


  const dispatch =
    useAppDispatch();


  const navigate =
    useNavigate();


  useEffect(() => {
    dispatch(GetCart());
    dispatch(GetAllCoupons());
  }, [dispatch]);


  const user =
    useAppSelector(
      (state) =>
        state.auth?.user || null
    );

  const savedAddresses = useAppSelector(
    (state) => state.address?.addresses || []
  );


  const cartState =
    useAppSelector(
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
    Number(
      cartState.subtotal || 0
    );


  const couponState =
    useAppSelector(
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


  const orderState =
    useAppSelector(
      (state) => state.order || {}
    );


  const actionLoading =
    Boolean(orderState.actionLoading);


  const error =
    orderState.error || null;


  const addresses = savedAddresses.length
    ? savedAddresses
    : Array.isArray(user?.addresses)
      ? user.addresses
      : [];


  const steps = [
    ["Address", MapPin],
    ["Payment", CreditCard],
    ["Review", PackageCheck],
  ];


  const selectedAddress =
    useMemo(() => {
      return addresses.find(
        (address) =>
          String(address._id) ===
          String(addressId)
      );

    }, [
      addressId,
      addresses,
    ]);


  const checkoutAddress =
    selectedAddress
      ? {
          fullName:
            selectedAddress.fullName ||
            selectedAddress.fullname ||
            user?.name ||
            "",

          phone:
            selectedAddress.phone ||
            user?.phone ||
            "",

          pincode:
            selectedAddress.pincode ||
            "",

          city:
            selectedAddress.city ||
            "",

          state:
            selectedAddress.state ||
            "",

          area:
            selectedAddress.area ||
            selectedAddress.landmark ||
            "",

          houseNo:
            selectedAddress.houseNo ||
            selectedAddress.house ||
            "",
        }

      : manualAddress;


  const calculatedSubtotal =
    useMemo(() => {
      return items.reduce(
        (total, item) => {
          const product =
            item.product || item;


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

    }, [items]);


  const cartSubtotal =
    Number(backendSubtotal) > 0
      ? Number(backendSubtotal)
      : calculatedSubtotal;


  const discount =
    Number(
      discountAmount || 0
    );


  const total =
    appliedCoupon
      ? Number(
          finalTotal || 0
        )
      : cartSubtotal;


  const hasAddress =
    Boolean(
      checkoutAddress.fullName &&
      checkoutAddress.phone &&
      checkoutAddress.pincode &&
      checkoutAddress.city &&
      checkoutAddress.state &&
      checkoutAddress.houseNo
    );

  const hasSelectedAddress = Boolean(selectedAddress?._id);


  const HandleAddressChange =
    (key, value) => {
      setAddressId("");


      setManualAddress(
        (previous) => ({
          ...previous,
          [key]: value,
        })
      );
      setAddressError("");
    };

  const saveAddress = async () => {
    if (!hasAddress) {
      setAddressError("Please complete all required delivery address fields.");
      return;
    }
    const result = await dispatch(AddAddress(manualAddress));
    if (AddAddress.fulfilled.match(result)) {
      setAddressId(result.payload.address._id);
      setManualAddress(emptyAddress);
      setAddressError("");
      dispatch(GetProfile());
    } else {
      setAddressError(result.payload?.message || "Unable to save this address.");
    }
  };


  const HandleApplyCode = async (code) => {
    if (!code.trim()) {
      return;
    }

    await dispatch(
      ApplyCoupon({
        code: code.trim().toUpperCase(),
        subtotal: cartSubtotal,
      })
    );
  };


  const HandleCouponSubmit = async (event) => {
    event.preventDefault();
    await HandleApplyCode(couponCode);
  };


  const HandleTapCoupon = async (code) => {
    setCouponCode(code);
    await HandleApplyCode(code);
  };


  const HandleRemoveCoupon = () => {
    setCouponCode("");
    dispatch(RemoveAppliedCoupon());
  };


  const PlaceOrder =
    async () => {
      if (!hasAddress) {
        return;
      }


      if (!items.length) {
        return;
      }


      const orderData = {
        addressId,
        address:
          checkoutAddress,

        paymentMethod,

        couponCode:
          appliedCoupon?.code || "",

        discountPrice:
          discount,

        items: items.map((item) => ({
          product:
            item.product?._id ||
            item.product ||
            item.productId,

          color:
            item.color || "",

          size:
            item.size || "",

          quantity:
            Number(
              item.quantity || 1
            ),
        })),
      };


      const result =
        await dispatch(
          CreateOrder(orderData)
        );


      if (
        CreateOrder.fulfilled
          .match(result)
      ) {
        const order =
          result.payload?.order;


        dispatch(
          ResetCart()
        );


        dispatch(
          RemoveAppliedCoupon()
        );


        dispatch(
          GetCart()
        );


        dispatch(
          GetProfile()
        );


        if (order?._id) {
          navigate(
            `/orders/${order._id}`
          );
        } else {
          navigate("/orders");
        }
      }
    };


  return (
    <main className="page checkout-page">

      <style>{`
        .checkout-page * { box-sizing: border-box; }

        .checkout-steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 28px 0;
        }

        .checkout-coupon-chips {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }
        .checkout-coupon-chip {
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
          width: 100%;
        }
        .checkout-coupon-chip.applied {
          border: 1px solid #3f7a4f;
          background: #eaf4ec;
          cursor: default;
        }
        .checkout-coupon-chip-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .checkout-coupon-code {
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.03em;
          white-space: nowrap;
        }
        .checkout-coupon-meta { display: flex; flex-direction: column; min-width: 0; }
        .checkout-coupon-meta span:first-child { font-size: 12.5px; font-weight: 600; }
        .checkout-coupon-meta span:last-child {
          font-size: 11px;
          color: var(--ink-soft, #736b58);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .checkout-coupon-apply-btn {
          flex-shrink: 0;
          font-size: 11px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: none;
          border: 1px solid var(--ink, #201d19);
          border-radius: 20px;
          padding: 5px 12px;
        }

        @media (max-width: 640px) {
          .checkout-steps { gap: 8px; }
          .checkout-steps .btn { padding: 10px 6px; font-size: 12px; gap: 6px; }
          .checkout-review-grid { grid-template-columns: 1fr !important; }
          .checkout-address-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section className="section">

        <div className="container">

          <span className="eyebrow">
            Secure checkout
          </span>


          <h1 className="title">
            Complete your order
          </h1>


          <div
            className="checkout-steps"
          >

            {steps.map(
              (
                [label, Icon],
                index
              ) => (
                <button
                  key={label}

                  type="button"

                  className={
                    `btn ${
                      step === index
                        ? "btn-primary"
                        : "btn-soft"
                    }`
                  }

                  onClick={() => {
                    if (index === 0 || (index === 1 && hasAddress) || (index === 2 && hasAddress && paymentMethod)) setStep(index);
                  }}
                >
                  <Icon size={16} />

                  {label}
                </button>
              )
            )}

          </div>


          <div
            className="card"

            style={{
              padding: 26,
            }}
          >


            {step === 0 && (
              <div
                style={{
                  display: "grid",
                  gap: 22,
                }}
              >

                {addresses.length >
                  0 && (

                  <div className="grid grid-2 checkout-address-grid">

                    {addresses.map(
                      (address) => (
                        <button
                          key={
                            address._id
                          }

                          type="button"

                          className={
                            `card ${
                              String(addressId) ===
                              String(address._id)
                                ? ""
                                : "card-hover"
                            }`
                          }

                          style={{
                            padding: 18,

                            textAlign:
                              "left",

                            borderColor:
                              String(addressId) ===
                              String(address._id)
                                ? "var(--ink)"
                                : "var(--line)",
                          }}

                          onClick={() =>
                            setAddressId(
                              address._id
                            )
                          }
                        >

                          <span className="badge">
                            {
                              address.type ||
                              address.badge ||
                              "Saved"
                            }
                          </span>


                          <p>
                            {
                              [
                                address.houseNo ||
                                  address.house,

                                address.area,

                                address.city,

                                address.state,

                                address.pincode,
                              ]
                                .filter(
                                  Boolean
                                )
                                .join(", ")
                            }
                          </p>

                        </button>
                      )
                    )}

                  </div>

                )}


                <div>

                  <span className="eyebrow">
                    Delivery Address
                  </span>


                  <div
                    className="grid grid-2 checkout-address-grid"

                    style={{
                      marginTop: 16,
                    }}
                  >

                    {Object.keys(emptyAddress).map((key) => (

                      <div
                        className="field"
                        key={key}
                      >

                        <label>
                          {key === "houseNo" ? "House / Flat No." : key === "fullName" ? "Full name" : key}
                        </label>


                        <input
                          className="input"

                          value={
                            checkoutAddress[
                              key
                            ] || ""
                          }

                          disabled={
                            Boolean(
                              selectedAddress
                            )
                          }

                          onChange={(
                            event
                          ) =>
                            HandleAddressChange(
                              key,
                              event.target
                                .value
                            )
                          }
                        />

                      </div>

                    ))}

                  </div>

                  {addressError && <p className="subtitle" style={{ color: "#b42318", marginTop: 10 }}>{addressError}</p>}

                  {!selectedAddress && (
                    <button className="btn btn-secondary" type="button" disabled={!hasAddress} onClick={saveAddress}>
                      Save delivery address
                    </button>
                  )}


                  <button
                    className="btn btn-primary"
                    type="button"

                    disabled={
                      !hasSelectedAddress
                    }

                    onClick={() =>
                      setStep(1)
                    }
                  >
                    {hasSelectedAddress ? "Continue to Payment" : "Save or select an address first"}
                  </button>

                </div>

              </div>
            )}


            {step === 1 && (
              <div
                style={{
                  display: "grid",
                  gap: 20,
                }}
              >

                <div className="grid grid-2 checkout-address-grid">

                  <button
                    type="button"

                    className={
                      `btn ${
                        paymentMethod ===
                        "COD"
                          ? "btn-primary"
                          : "btn-soft"
                      }`
                    }

                    onClick={() =>
                      setPaymentMethod(
                        "COD"
                      )
                    }
                  >
                    Cash On Delivery
                  </button>


                  <div className="btn btn-soft" style={{ cursor: "not-allowed", opacity: 0.65 }} title="Online payments are not configured yet">
                    Online payment coming soon
                  </div>

                </div>


                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    className="btn btn-soft"
                    type="button"

                    onClick={() =>
                      setStep(0)
                    }
                  >
                    Back to Address
                  </button>


                  <button
                    className="btn btn-primary"
                    type="button"

                    disabled={
                      !paymentMethod
                    }

                    onClick={() =>
                      setStep(2)
                    }
                  >
                    Review Order
                  </button>

                </div>

              </div>
            )}


            {step === 2 && (
              <div className="grid grid-2 checkout-review-grid">


                <div>

                  <span className="eyebrow">
                    Items
                  </span>


                  <div
                    style={{
                      display: "grid",
                      gap: 14,
                      marginTop: 14,
                    }}
                  >

                    {items.map(
                      (item) => {
                        const product =
                          item.product ||
                          item;


                        const price =
                          Number(
                            product.finalPrice ??
                            item.price ??
                            product.price ??
                            0
                          );


                        const quantity =
                          Number(
                            item.quantity ||
                            1
                          );


                        const image =
                          getItemImage(
                            product,
                            item.color
                          );


                        return (
                          <div
                            key={
                              item._id ||
                              `${product._id}-${item.color}-${item.size}`
                            }

                            style={{
                              display:
                                "flex",

                              justifyContent:
                                "space-between",

                              alignItems:
                                "center",

                              gap: 14,

                              paddingBottom:
                                14,

                              borderBottom:
                                "1px solid var(--line)",
                            }}
                          >

                            <div
                              style={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap: 12,
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
                                    width: 58,
                                    height: 70,

                                    objectFit:
                                      "cover",

                                    borderRadius:
                                      8,
                                  }}
                                />
                              ) : (
                                <div
                                  className="skeleton"

                                  style={{
                                    width: 58,
                                    height: 70,
                                    borderRadius:
                                      8,
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
                                    marginTop:
                                      5,
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
                                      .join(
                                        " / "
                                      )
                                  }
                                </div>


                                <div
                                  className="product-meta"

                                  style={{
                                    marginTop:
                                      3,
                                  }}
                                >
                                  Qty:{" "}
                                  {
                                    quantity
                                  }
                                </div>

                              </div>

                            </div>


                            <strong>
                              {
                                money(
                                  price *
                                    quantity
                                )
                              }
                            </strong>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>


                <div
                  className="card"

                  style={{
                    padding: 18,
                    height:
                      "fit-content",
                  }}
                >

                  <span className="eyebrow">
                    Summary
                  </span>


                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      marginTop: 14,
                      marginBottom: 16,
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                      }}
                    >
                      <span>
                        Subtotal
                      </span>

                      <strong>
                        {
                          money(
                            cartSubtotal
                          )
                        }
                      </strong>
                    </div>


                    {appliedCoupon && (
                      <div
                        style={{
                          display:
                            "flex",

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
                              discount
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

                        borderTop:
                          "1px solid var(--line)",

                        paddingTop: 10,
                      }}
                    >
                      <span>
                        Total
                      </span>

                      <strong>
                        {
                          money(total)
                        }
                      </strong>
                    </div>


                    <div
                      className="product-meta"

                      style={{
                        marginTop: 6,
                      }}
                    >
                      Payment:{" "}
                      {paymentMethod}
                    </div>

                  </div>


                  {/* APPLIED COUPON */}
                  {appliedCoupon && (
                    <div className="checkout-coupon-chip applied" style={{ marginBottom: 16 }}>
                      <div className="checkout-coupon-chip-left">
                        <BadgePercent size={16} />
                        <div className="checkout-coupon-meta">
                          <span>{appliedCoupon.code} applied</span>
                          <span>You saved {money(discount)}</span>
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
                      <div className="checkout-coupon-chips">
                        {availableCoupons.map((couponItem) => {
                          const { headline, sub } = describeCoupon(couponItem);
                          return (
                            <button
                              type="button"
                              key={couponItem._id || couponItem.code}
                              className="checkout-coupon-chip"
                              onClick={() => HandleTapCoupon(couponItem.code)}
                              disabled={applyLoading}
                            >
                              <div className="checkout-coupon-chip-left">
                                <BadgePercent size={16} />
                                <div className="checkout-coupon-meta">
                                  <span>
                                    <span className="checkout-coupon-code">{couponItem.code}</span>
                                    {"  "}
                                    {headline}
                                  </span>
                                  <span>{sub}</span>
                                </div>
                              </div>
                              <span className="checkout-coupon-apply-btn">Apply</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  {!appliedCoupon && (
                    <form
                      style={{
                        display: "flex",
                        gap: 8,
                        marginBottom: 16,
                      }}
                      onSubmit={HandleCouponSubmit}
                    >
                      <input
                        className="input"
                        value={couponCode}
                        onChange={(event) => setCouponCode(event.target.value)}
                        placeholder="Have a coupon code?"
                      />
                      <button
                        className="btn btn-secondary"
                        type="submit"
                        disabled={applyLoading}
                      >
                        {applyLoading ? "Applying..." : "Apply"}
                      </button>
                    </form>
                  )}


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


                  {error && (
                    <small
                      className="field-error"

                      style={{
                        display: "block",
                        marginTop: 12,
                      }}
                    >
                      {error}
                    </small>
                  )}


                  <div
                    style={{
                      display: "grid",
                      gap: 10,
                      marginTop: 18,
                    }}
                  >

                    <button
                      className="btn btn-soft"
                      type="button"

                      onClick={() =>
                        setStep(1)
                      }
                    >
                      Back to Payment
                    </button>


                    <button
                      className="btn btn-primary"
                      type="button"

                      disabled={
                        !items.length ||
                        !hasAddress ||
                        actionLoading
                      }

                      onClick={
                        PlaceOrder
                      }
                    >
                      {
                        actionLoading
                          ? "Placing Order..."
                          : "Place Order"
                      }
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

      </section>

    </main>
  );
}
