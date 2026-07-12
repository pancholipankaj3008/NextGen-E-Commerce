import {
  Calendar,
  Check,
  Heart,
  Home,
  Lock,
  LogOut,
  MapPin,
  Package,
  Save,
  Trash2,
  User,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import ProductCard from "../components/ProductCard";


import {
  AddAddress,
  RemoveAddress,
} from "../features/address/addressThunk";

import {
  SetAddresses,
  ClearAddressMessage,
} from "../features/address/addressSlice";


import {
  ClearMessage,
} from "../features/auth/authSlice";

import {
  Logout,
  UpdateProfile,
  ChangePassword,
} from "../features/auth/authThunk";


import {
  AddToCart,
} from "../features/cart/cartThunk";


import {
  GetMyOrders,
} from "../features/order/orderThunk";


import {
  GetWishlist,
  RemoveWishlist,
} from "../features/wishlist/wishlistThunk";


import {
  ClearWishlistMessage,
} from "../features/wishlist/wishlistSlice";


import {
  useAppDispatch,
  useAppSelector,
} from "../hooks/reduxHooks";


import {
  firstAvailableVariant,
} from "../utils/product";



const emptyAddress = {
  type: "Home",
  house: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  phone: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));



export function Account() {

  const [tab, setTab] =
    useState("profile");


  const [profile, setProfile] =
    useState({
      name: "",
      phone: "",
      gender: "",
      dob: "",
    });

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });


  const [address, setAddress] =
    useState(emptyAddress);


  const dispatch = useAppDispatch();



  // AUTH STATE

  const {
    user,
    loading,
    message: authMessage,
    error: authError,
  } = useAppSelector(
    (state) => state.auth
  );



  // WISHLIST STATE

  const {
    wishlist,
    message: wishlistMessage,
    error: wishlistError,
  } = useAppSelector(
    (state) => state.wishlist
  );



  // ORDER STATE

  const {
    myOrders,
  } = useAppSelector(
    (state) => state.order
  );



  // ADDRESS STATE

  const {
    addresses,
    loading: addressLoading,
    message: addressMessage,
    error: addressError,
  } = useAppSelector(
    (state) => state.address
  );



  // PROFILE DATA SET

  useEffect(() => {

    if (user) {

      setProfile({

        name:
          user.name || "",

        phone:
          user.phone || "",

        gender:
          user.gender || "",

        dob:
          user.dob?.slice?.(0, 10) || "",

      });


      if (user.addresses) {

        dispatch(
          SetAddresses(user.addresses)
        );

      }

    }

  }, [user, dispatch]);



  // LOAD ACCOUNT DATA

  useEffect(() => {

    dispatch(GetWishlist());

    dispatch(GetMyOrders());

  }, [dispatch]);



  // AUTH MESSAGE

  useEffect(() => {

    if (authMessage) {

      toast.success(authMessage);

      dispatch(ClearMessage());

    }

    if (authError) {

      toast.error(authError);

      dispatch(ClearMessage());

    }

  }, [
    authMessage,
    authError,
    dispatch,
  ]);



  // ADDRESS MESSAGE

  useEffect(() => {

    if (addressMessage) {

      toast.success(addressMessage);

      dispatch(
        ClearAddressMessage()
      );

    }

    if (addressError) {

      toast.error(addressError);

      dispatch(
        ClearAddressMessage()
      );

    }

  }, [
    addressMessage,
    addressError,
    dispatch,
  ]);



  // WISHLIST MESSAGE

  useEffect(() => {

    if (wishlistMessage) {

      toast.success(
        wishlistMessage
      );

      dispatch(
        ClearWishlistMessage()
      );

    }

    if (wishlistError) {

      toast.error(
        wishlistError
      );

      dispatch(
        ClearWishlistMessage()
      );

    }

  }, [
    wishlistMessage,
    wishlistError,
    dispatch,
  ]);



  const wishlistCount =
    wishlist.length;



  const stats = useMemo(
    () => [

      [
        "Total Orders",
        myOrders.length,
        Package,
      ],

      [
        "Wishlist Items",
        wishlistCount,
        Heart,
      ],

      [
        "Address Count",
        addresses.length,
        MapPin,
      ],

      [
        "Member Since",
        user?.createdAt
          ? new Date(
              user.createdAt
            ).getFullYear()
          : "-",
        Calendar,
      ],

    ],
    [
      addresses.length,
      myOrders.length,
      user?.createdAt,
      wishlistCount,
    ]
  );



  const saveProfile = (event) => {

    event.preventDefault();

    dispatch(
      UpdateProfile(profile)
    );

  };



  const saveAddress = async (event) => {

    event.preventDefault();

    const result =
      await dispatch(
        AddAddress(address)
      );

    if (
      AddAddress.fulfilled.match(result)
    ) {

      setAddress(emptyAddress);

    }

  };

  const changePassword = async (event) => {

    event.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {

      toast.error("New password and confirm password do not match");

      return;

    }

    const result = await dispatch(
      ChangePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
    );

    if (ChangePassword.fulfilled.match(result)) {

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    }

  };



  const handleAddToCart = (
    product
  ) => {

    dispatch(
      AddToCart({

        productId:
          product._id ||
          product.id,

        quantity: 1,

        ...firstAvailableVariant(
          product
        ),

      })
    );

  };



  const handleRemoveWishlist = (
    product
  ) => {

    dispatch(
      RemoveWishlist(
        product._id ||
        product.id
      )
    );

  };



  const nav = [

    [
      "profile",
      "Profile",
      User,
    ],

    [
      "orders",
      "Orders",
      Package,
    ],

    [
      "wishlist",
      "Wishlist",
      Heart,
    ],

    [
      "addresses",
      "Addresses",
      Home,
    ],

    [
      "password",
      "Change Password",
      Lock,
    ],

  ];



  return (
    <>

      <main className="page">

        <section className="section">

          <div
            className="container account-layout"
          >


            {/* SIDEBAR */}

            <aside
              className="card account-sidebar"
            >

              <div
                style={{
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >

                <h1 className="product-name">

                  {user?.name ||
                    "NextGen Member"}

                </h1>


                <p className="product-meta">

                  {user?.email}

                </p>


                <span
                  className="badge"
                  style={{
                    marginTop: 10,
                  }}
                >

                  <Check size={12} />

                  {user?.isVerified
                    ? "Verified"
                    : "Account"}

                </span>

              </div>



              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >

                {nav.map(
                  ([
                    key,
                    label,
                    Icon,
                  ]) => (

                    <button
                      key={key}
                      className={`btn ${
                        tab === key
                          ? "btn-primary"
                          : "btn-soft"
                      }`}
                      style={{
                        justifyContent:
                          "flex-start",
                      }}
                      onClick={() =>
                        setTab(key)
                      }
                    >

                      <Icon size={15} />

                      {label}

                    </button>

                  )
                )}


                <button
                  className="btn btn-danger"
                  style={{
                    justifyContent:
                      "flex-start",
                  }}
                  onClick={() =>
                    dispatch(Logout())
                  }
                >

                  <LogOut size={15} />

                  Logout

                </button>

              </div>

            </aside>



            {/* CONTENT */}

            <div className="account-content">


              {/* STATS */}

              <div className="grid grid-4 account-stats">

                {stats.map(
                  ([
                    label,
                    value,
                    Icon,
                  ]) => (

                    <div
                      key={label}
                      className="card card-hover"
                      style={{
                        padding: 18,
                        textAlign: "center",
                      }}
                    >

                      <div
                        className="empty-mark"
                        style={{
                          width: 46,
                          height: 46,
                          marginBottom: 10,
                        }}
                      >

                        <Icon size={18} />

                      </div>


                      <strong
                        style={{
                          fontFamily:
                            "Cormorant Garamond",
                          fontSize: 30,
                        }}
                      >

                        {value}

                      </strong>


                      <div className="eyebrow">

                        {label}

                      </div>

                    </div>

                  )
                )}

              </div>



              {/* PROFILE */}

              {tab === "profile" && (

                <form
                  className="card"
                  style={{
                    padding: 26,
                  }}
                  onSubmit={
                    saveProfile
                  }
                >

                  <span className="eyebrow">

                    Profile Information

                  </span>


                  <div
                    className="grid grid-2"
                    style={{
                      marginTop: 20,
                    }}
                  >


                    <div className="field">

                      <label>Name</label>

                      <input
                        className="input"
                        value={
                          profile.name
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            name:
                              e.target
                                .value,
                          })
                        }
                      />

                    </div>


                    <div className="field">

                      <label>Phone</label>

                      <input
                        className="input"
                        value={
                          profile.phone
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone:
                              e.target
                                .value,
                          })
                        }
                      />

                    </div>


                    <div className="field">

                      <label>Gender</label>

                      <select
                        className="select"
                        value={
                          profile.gender
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            gender:
                              e.target
                                .value,
                          })
                        }
                      >

                        <option value="">
                          Select
                        </option>

                        <option>
                          Male
                        </option>

                        <option>
                          Female
                        </option>

                        <option>
                          Other
                        </option>

                      </select>

                    </div>


                    <div className="field">

                      <label>DOB</label>

                      <input
                        className="input"
                        type="date"
                        value={
                          profile.dob
                        }
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            dob:
                              e.target
                                .value,
                          })
                        }
                      />

                    </div>


                    <div className="field">

                      <label>
                        Member Since
                      </label>

                      <input
                        className="input"
                        value={
                          user?.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : ""
                        }
                        readOnly
                      />

                    </div>

                  </div>


                  <button
                    className="btn btn-primary"
                    style={{
                      marginTop: 20,
                    }}
                    disabled={loading}
                  >

                    <Save size={16} />

                    Save Profile

                  </button>


                </form>

              )}



              {/* WISHLIST */}

              {tab === "wishlist" && (

                <div
                  className="card"
                  style={{
                    padding: 26,
                  }}
                >

                  <span className="eyebrow">

                    Wishlist

                  </span>


                  {wishlist.length === 0 ? (

                    <p className="subtitle">

                      No wishlist items yet.

                    </p>

                  ) : (

                    <div
                      className="grid grid-3"
                      style={{
                        marginTop: 20,
                      }}
                    >

                      {wishlist.map(
                        (item) => {

                          const product =
                            item.product ||
                            item;

                          return (

                            <ProductCard
                              key={
                                product._id ||
                                product.id ||
                                product.slug
                              }

                              product={
                                product
                              }

                              isWishlisted

                              onCart={() =>
                                handleAddToCart(
                                  product
                                )
                              }

                              onWishlist={() =>
                                handleRemoveWishlist(
                                  product
                                )
                              }
                            />

                          );

                        }
                      )}

                    </div>

                  )}

                </div>

              )}



              {/* ADDRESSES */}

              {tab === "addresses" && (

                <div className="grid">

                  <form
                    className="card"
                    style={{
                      padding: 26,
                    }}
                    onSubmit={
                      saveAddress
                    }
                  >

                    <span className="eyebrow">

                      Add Address

                    </span>


                    <div
                      className="grid grid-2"
                      style={{
                        marginTop: 20,
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
                              address[key]
                            }
                            onChange={(
                              e
                            ) =>
                              setAddress({
                                ...address,
                                [key]:
                                  e.target
                                    .value,
                              })
                            }
                          />

                        </div>

                      ))}

                    </div>


                    <button
                      className="btn btn-primary"
                      style={{
                        marginTop: 20,
                      }}
                      disabled={
                        addressLoading
                      }
                    >

                      Add Address

                    </button>

                  </form>



                  <div className="grid grid-2">

                    {addresses.map(
                      (addr) => (

                        <div
                          className="card card-hover"
                          key={addr._id}
                          style={{
                            padding: 20,
                          }}
                        >

                          <span className="badge">

                            {addr.type ||
                              "Address"}

                          </span>


                          <p>

                            {[
                              addr.fullName ||
                                addr.fullname,
                              addr.house ||
                                addr.houseNo,
                              addr.area,
                              addr.city,
                              addr.state,
                              addr.pincode,
                            ]
                              .filter(Boolean)
                              .join(", ")}

                          </p>


                          <p className="product-meta">

                            {addr.landmark}

                          </p>


                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              dispatch(
                                RemoveAddress(
                                  addr._id
                                )
                              )
                            }
                          >

                            <Trash2
                              size={15}
                            />

                            Delete

                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}


              {tab === "orders" && (

                <div
                  className="card"
                  style={{
                    padding: 26,
                  }}
                >

                  <span className="eyebrow">

                    Orders

                  </span>

                  {myOrders.length === 0 ? (

                    <p className="subtitle">

                      No orders yet.

                    </p>

                  ) : (

                    <div
                      style={{
                        display: "grid",
                        gap: 16,
                        marginTop: 20,
                      }}
                    >

                      {myOrders.map((order) => (

                        <div
                          key={order._id}
                          className="card card-hover"
                          style={{
                            padding: 18,
                          }}
                        >

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              flexWrap: "wrap",
                            }}
                          >

                            <div>

                              <strong>

                                {order.orderNumber || order._id}

                              </strong>

                              <p className="product-meta">

                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleDateString()
                                  : "-"}{" "}
                                / {order.paymentMethod || "COD"} / {order.paymentStatus || "pending"}

                              </p>

                            </div>

                            <div style={{ textAlign: "right" }}>

                              <span className="badge">

                                {order.orderStatus || "placed"}

                              </span>

                              <div className="price" style={{ marginTop: 6 }}>

                                {money(order.totalPrice)}

                              </div>

                            </div>

                          </div>

                          <div
                            style={{
                              display: "grid",
                              gap: 10,
                              marginTop: 16,
                            }}
                          >

                            {(order.orderItems || []).map((item) => (

                              <div
                                key={item._id || `${item.title}-${item.size}-${item.color}`}
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "52px 1fr auto",
                                  gap: 12,
                                  alignItems: "center",
                                }}
                              >

                                {item.image ? (

                                  <img
                                    src={item.image}
                                    alt={item.title || item.tittle || "Product"}
                                    style={{
                                      width: 52,
                                      height: 62,
                                      borderRadius: 8,
                                      objectFit: "cover",
                                    }}
                                  />

                                ) : (

                                  <div
                                    className="skeleton"
                                    style={{
                                      width: 52,
                                      height: 62,
                                      borderRadius: 8,
                                    }}
                                  />

                                )}

                                <div>

                                  <strong>

                                    {item.title || item.tittle || item.product?.title || "Product"}

                                  </strong>

                                  <div className="product-meta">

                                    {[item.color, item.size].filter(Boolean).join(" / ")} x {item.quantity}

                                  </div>

                                </div>

                                <strong>

                                  {money(Number(item.price || 0) * Number(item.quantity || 1))}

                                </strong>

                              </div>

                            ))}

                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              alignItems: "center",
                              marginTop: 16,
                              flexWrap: "wrap",
                            }}
                          >

                            <p className="product-meta" style={{ margin: 0 }}>

                              {[
                                order.shippingAddress?.fullName,
                                order.shippingAddress?.houseNo,
                                order.shippingAddress?.area,
                                order.shippingAddress?.city,
                                order.shippingAddress?.state,
                                order.shippingAddress?.pincode,
                              ].filter(Boolean).join(", ")}

                            </p>

                            <Link className="btn btn-secondary" to={`/orders/${order._id}`}>

                              Details

                            </Link>

                          </div>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}


              {tab === "password" && (

                <form
                  className="card"
                  style={{
                    padding: 26,
                  }}
                  onSubmit={changePassword}
                >

                  <span className="eyebrow">

                    Change Password

                  </span>

                  <div className="grid grid-2" style={{ marginTop: 20 }}>

                    <div className="field">

                      <label>Current Password</label>

                      <input
                        className="input"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />

                    </div>

                    <div className="field">

                      <label>New Password</label>

                      <input
                        className="input"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />

                    </div>

                    <div className="field">

                      <label>Confirm Password</label>

                      <input
                        className="input"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                        minLength={6}
                      />

                    </div>

                  </div>

                  <button
                    className="btn btn-primary"
                    style={{
                      marginTop: 20,
                    }}
                    disabled={loading}
                  >

                    <Lock size={16} />

                    {loading ? "Changing..." : "Change Password"}

                  </button>

                </form>

              )}



              {/* OTHER TABS */}

              {tab !== "profile" &&
                tab !== "addresses" &&
                tab !== "wishlist" &&
                tab !== "orders" &&
                tab !== "password" && (

                  <div
                    className="card"
                    style={{
                      padding: 32,
                    }}
                  >

                    <span className="eyebrow">

                      {tab}

                    </span>


                    <h2
                      className="title"
                      style={{
                        marginTop: 10,
                      }}
                    >

                      Managed through dedicated NextGen modules.

                    </h2>


                    <p className="subtitle">

                      Use the main navigation for full {tab} workflows.
                      This profile sidebar keeps account access close.

                    </p>

                  </div>

                )}

            </div>

          </div>

        </section>

      </main>

    </>
  );
}
