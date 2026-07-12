const mongoose = require("mongoose");

const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const User = require("../Models/User");
const Product = require("../Models/Product");


// =====================================================
// HELPERS
// =====================================================

function normalizePaymentMethod(method) {
  const allowedMethods = [
    "COD",
    "Razorpay",
    "Stripe",
  ];

  if (allowedMethods.includes(method)) {
    return method;
  }

  return "COD";
}


function orderNumber(order) {
  return `NG-${String(order._id)
    .slice(-8)
    .toUpperCase()}`;
}


function serializeOrder(order) {
  const data =
    typeof order.toObject === "function"
      ? order.toObject()
      : order;

  return {
    ...data,

    orderNumber: orderNumber(data),
  };
}


function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  return image.url || "";
}


function getProductImage(
  product,
  selectedVariant
) {
  const variantImage =
    selectedVariant?.images?.[0];

  if (variantImage) {
    return getImageUrl(variantImage);
  }

  const productImage =
    product?.images?.[0];

  return getImageUrl(productImage);
}


// =====================================================
// PLACE ORDER
// =====================================================

async function PlaceOrder(req, res) {
  const session =
    await mongoose.startSession();

  try {
    const {
      address,
      addressId,
      paymentMethod = "COD",
      couponCode = "",
      discountPrice = 0,
    } = req.body;


    session.startTransaction();


    // =================================================
    // GET CART + USER
    // =================================================

    const cart = await Cart.findOne({
      user: req.id,
    })
      .populate("items.product")
      .session(session);


    const user = await User.findById(
      req.id
    ).session(session);


    if (
      !cart ||
      !cart.items ||
      cart.items.length === 0
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,

        message: "Cart is empty",
      });
    }


    // =================================================
    // SHIPPING ADDRESS
    // =================================================

    let shippingAddress = address;


    if (
      !shippingAddress &&
      addressId
    ) {
      shippingAddress =
        user?.addresses?.id(
          addressId
        );
    }


    if (!shippingAddress) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,

        message:
          "Delivery address is required",
      });
    }


    shippingAddress = {
      fullName:
        shippingAddress.fullName ||
        shippingAddress.fullname ||
        user?.name ||
        "",

      phone:
        shippingAddress.phone ||
        user?.phone ||
        "",

      pincode:
        shippingAddress.pincode ||
        "",

      city:
        shippingAddress.city ||
        "",

      state:
        shippingAddress.state ||
        "",

      area:
        shippingAddress.area ||
        shippingAddress.landmark ||
        "",

      houseNo:
        shippingAddress.houseNo ||
        shippingAddress.house ||
        "",
    };


    // =================================================
    // VALIDATE ADDRESS
    // =================================================

    const requiredAddressFields = [
      "fullName",
      "phone",
      "pincode",
      "city",
      "state",
      "houseNo",
    ];


    for (
      const field
      of requiredAddressFields
    ) {
      if (
        !String(
          shippingAddress[field] || ""
        ).trim()
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            `${field} is required`,
        });
      }
    }


    // =================================================
    // SAVE NEW ADDRESS TO USER
    // =================================================

    if (
      !addressId &&
      user
    ) {
      const alreadySaved =
        user.addresses?.some(
          (savedAddress) =>
            String(
              savedAddress.phone || ""
            ) ===
              String(
                shippingAddress.phone || ""
              ) &&

            String(
              savedAddress.pincode || ""
            ) ===
              String(
                shippingAddress.pincode ||
                  ""
              ) &&

            String(
              savedAddress.city || ""
            ).toLowerCase() ===
              String(
                shippingAddress.city || ""
              ).toLowerCase() &&

            String(
              savedAddress.houseNo ||
                savedAddress.house ||
                ""
            ).toLowerCase() ===
              String(
                shippingAddress.houseNo ||
                  ""
              ).toLowerCase()
        );


      if (!alreadySaved) {
        user.addresses.push({
          type: "Home",

          fullName:
            shippingAddress.fullName,

          fullname:
            shippingAddress.fullName,

          phone:
            shippingAddress.phone,

          pincode:
            shippingAddress.pincode,

          city:
            shippingAddress.city,

          state:
            shippingAddress.state,

          area:
            shippingAddress.area,

          houseNo:
            shippingAddress.houseNo,

          house:
            shippingAddress.houseNo,
        });


        await user.save({
          session,
        });
      }
    }


    // =================================================
    // VALIDATE ALL CART ITEMS FIRST
    // =================================================

    const validatedItems = [];

    let itemsPrice = 0;


    for (const cartItem of cart.items) {
      const product =
        cartItem.product;


      if (
        !product ||
        !product.isActive ||
        product.deletedAt
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            "A cart product is unavailable",
        });
      }


      const selectedVariant =
        product.variants.find(
          (variant) =>
            variant.color ===
            cartItem.color
        );


      if (!selectedVariant) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            `${product.title}: selected color is not available`,
        });
      }


      const selectedSize =
        selectedVariant.sizes.find(
          (sizeItem) =>
            sizeItem.size ===
            cartItem.size
        );


      if (!selectedSize) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            `${product.title}: size ${cartItem.size} is not available`,
        });
      }


      const quantity =
        Number(cartItem.quantity || 0);


      if (quantity < 1) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            "Invalid cart quantity",
        });
      }


      if (
        Number(selectedSize.stock || 0) <
        quantity
      ) {
        await session.abortTransaction();

        return res.status(400).json({
          success: false,

          message:
            `${product.title} - ${cartItem.color} - ${cartItem.size} has insufficient stock`,
        });
      }


      const price =
        Number(
          product.finalPrice ??
            product.price ??
            0
        );


      const image =
        getProductImage(
          product,
          selectedVariant
        );


      validatedItems.push({
        product,

        selectedVariant,

        selectedSize,

        quantity,

        orderItem: {
          product:
            product._id,

          title:
            product.title,

          image,

          productType:
            product.productType || "",

          category:
            product.category || "",

          color:
            cartItem.color,

          size:
            cartItem.size,

          sku:
            selectedSize.sku ||
            product.sku ||
            "",

          quantity,

          price,
        },
      });


      itemsPrice +=
        price * quantity;
    }


    // =================================================
    // UPDATE STOCK AFTER ALL VALIDATION PASSES
    // =================================================

    for (
      const item
      of validatedItems
    ) {
      item.selectedSize.stock -=
        item.quantity;


      item.product.soldCount =
        Number(
          item.product.soldCount || 0
        ) + item.quantity;


      /*
        Product model pre-save hook
        should recalculate totalStock
        from variants automatically.
      */

      await item.product.save({
        session,
      });
    }


    // =================================================
    // PRICE CALCULATION
    // =================================================

    const shippingPrice =
      itemsPrice >= 999
        ? 0
        : 79;


    const discount =
      Math.max(
        0,
        Number(discountPrice || 0)
      );


    const totalPrice =
      Math.max(
        0,

        itemsPrice +
          shippingPrice -
          discount
      );


    const method =
      normalizePaymentMethod(
        paymentMethod
      );


    // =================================================
    // CREATE ORDER
    // =================================================

    const createdOrders =
      await Order.create(
        [
          {
            user: req.id,

            orderItems:
              validatedItems.map(
                (item) =>
                  item.orderItem
              ),

            shippingAddress,

            paymentMethod:
              method,

            paymentStatus:
              method === "COD"
                ? "pending"
                : "paid",

            couponCode:
              String(
                couponCode || ""
              )
                .trim()
                .toUpperCase(),

            itemsPrice,

            shippingPrice,

            discountPrice:
              discount,

            totalPrice,

            trackingId:
              `TRK${Date.now()}`,

            estimatedDelivery:
              new Date(
                Date.now() +
                  5 *
                    24 *
                    60 *
                    60 *
                    1000
              ),
          },
        ],

        {
          session,
        }
      );


    const order =
      createdOrders[0];


    // =================================================
    // CLEAR CART
    // =================================================

    cart.items = [];


    await cart.save({
      session,
    });


    await session.commitTransaction();


    return res.status(201).json({
      success: true,

      message:
        "Order placed successfully",

      order:
        serializeOrder(order),
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to place order",
    });

  } finally {
    session.endSession();
  }
}


// =====================================================
// MY ORDERS
// =====================================================

async function MyOrders(req, res) {
  try {
    const orders =
      await Order.find({
        user: req.id,
      })
        .sort({
          createdAt: -1,
        });


    return res.json({
      success: true,

      orders:
        orders.map(
          serializeOrder
        ),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// GET SINGLE ORDER
// =====================================================

async function GetOrder(req, res) {
  try {
    const query = {
      _id: req.params.id,
    };


    if (req.role === "user") {
      query.user = req.id;
    }


    const order =
      await Order.findOne(
        query
      ).populate(
        "orderItems.product"
      );


    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }


    return res.json({
      success: true,

      order:
        serializeOrder(order),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// CANCEL ORDER
// =====================================================

async function CancelOrder(req, res) {
  const session =
    await mongoose.startSession();

  try {
    session.startTransaction();


    const order =
      await Order.findOne({
        _id: req.params.id,

        user: req.id,
      }).session(session);


    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }


    if (
      order.orderStatus ===
      "cancelled"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,

        message:
          "Order is already cancelled",
      });
    }


    if (
      [
        "shipped",
        "out for delivery",
        "delivered",
      ].includes(
        order.orderStatus
      )
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,

        message:
          "This order can not be cancelled now",
      });
    }


    // =================================================
    // RESTORE STOCK
    // =================================================

    for (
      const orderItem
      of order.orderItems
    ) {
      const product =
        await Product.findById(
          orderItem.product
        ).session(session);


      if (!product) {
        continue;
      }


      const variant =
        product.variants.find(
          (variantItem) =>
            variantItem.color ===
            orderItem.color
        );


      if (!variant) {
        continue;
      }


      const sizeItem =
        variant.sizes.find(
          (item) =>
            item.size ===
            orderItem.size
        );


      if (!sizeItem) {
        continue;
      }


      sizeItem.stock +=
        Number(
          orderItem.quantity || 0
        );


      product.soldCount =
        Math.max(
          0,

          Number(
            product.soldCount || 0
          ) -
            Number(
              orderItem.quantity || 0
            )
        );


      await product.save({
        session,
      });
    }


    order.orderStatus =
      "cancelled";


    order.cancelledAt =
      new Date();


    if (
      order.paymentStatus ===
      "paid"
    ) {
      order.paymentStatus =
        "refunded";
    }


    await order.save({
      session,
    });


    await session.commitTransaction();


    return res.json({
      success: true,

      message:
        "Order cancelled successfully",

      order:
        serializeOrder(order),
    });

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }


    return res.status(500).json({
      success: false,

      message: error.message,
    });

  } finally {
    session.endSession();
  }
}


// =====================================================
// GET ALL ORDERS - ADMIN
// =====================================================

async function GetAllOrders(
  req,
  res
) {
  try {
    const orders =
      await Order.find()
        .populate(
          "user",
          "name email phone"
        )
        .sort({
          createdAt: -1,
        });


    return res.json({
      success: true,

      orders:
        orders.map(
          serializeOrder
        ),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// UPDATE ORDER STATUS - ADMIN
// =====================================================

async function UpdateOrderStatus(
  req,
  res
) {
  try {
    const {
      orderStatus,
      paymentStatus,
    } = req.body;


    const order =
      await Order.findById(
        req.params.id
      );


    if (!order) {
      return res.status(404).json({
        success: false,

        message:
          "Order not found",
      });
    }


    if (orderStatus) {
      order.orderStatus =
        orderStatus;


      if (
        orderStatus ===
        "delivered"
      ) {
        order.deliveredAt =
          new Date();


        if (
          order.paymentMethod ===
            "COD" &&
          order.paymentStatus ===
            "pending"
        ) {
          order.paymentStatus =
            "paid";
        }
      }
    }


    if (paymentStatus) {
      order.paymentStatus =
        paymentStatus;
    }


    await order.save();


    return res.json({
      success: true,

      message:
        "Order updated successfully",

      order:
        serializeOrder(order),
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  PlaceOrder,

  MyOrders,

  GetOrder,

  CancelOrder,

  GetAllOrders,

  UpdateOrderStatus,
};