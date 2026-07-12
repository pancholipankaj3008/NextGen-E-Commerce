import {
  CreditCard,
  MapPin,
  PackageCheck,
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
  RemoveAppliedCoupon,
} from "../features/coupon/couponSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";


const emptyAddress = {
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  area: "",
  houseNo: "",
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


  const dispatch =
    useAppDispatch();


  const navigate =
    useNavigate();


  useEffect(() => {
    dispatch(GetCart());
  }, [dispatch]);


  const user =
    useAppSelector(
      (state) =>
        state.auth?.user || null
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


  const orderState =
    useAppSelector(
      (state) => state.order || {}
    );


  const actionLoading =
    Boolean(orderState.actionLoading);


  const error =
    orderState.error || null;


  const addresses =
    Array.isArray(user?.addresses)
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


  const HandleAddressChange =
    (key, value) => {
      setAddressId("");


      setManualAddress(
        (previous) => ({
          ...previous,
          [key]: value,
        })
      );
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
    <main className="page">

      <section className="section">

        <div className="container">

          <span className="eyebrow">
            Secure checkout
          </span>


          <h1 className="title">
            Complete your order
          </h1>


          <div
            className="grid grid-3"

            style={{
              margin: "28px 0",
            }}
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

                  onClick={() =>
                    setStep(index)
                  }
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

                  <div className="grid grid-2">

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
                    className="grid grid-2"

                    style={{
                      marginTop: 16,
                    }}
                  >

                    {Object.keys(
                      emptyAddress
                    ).map((key) => (

                      <div
                        className="field"
                        key={key}
                      >

                        <label>
                          {key}
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


                  <button
                    className="btn btn-primary"
                    type="button"

                    disabled={
                      !hasAddress
                    }

                    onClick={() =>
                      setStep(1)
                    }
                  >
                    Continue to Payment
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

                <div className="grid grid-2">

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


                  <button
                    type="button"

                    className={
                      `btn ${
                        paymentMethod ===
                        "Razorpay"
                          ? "btn-primary"
                          : "btn-soft"
                      }`
                    }

                    onClick={() =>
                      setPaymentMethod(
                        "Razorpay"
                      )
                    }
                  >
                    Online Payment /
                    Razorpay
                  </button>

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
              <div className="grid grid-2">


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