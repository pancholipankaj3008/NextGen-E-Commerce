const mongoose = require("mongoose");


// =====================================================
// ORDER ITEM SCHEMA
// =====================================================

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    productType: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      trim: true,
      default: "",
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      trim: true,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: true,
  }
);


// =====================================================
// SHIPPING ADDRESS SCHEMA
// =====================================================

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      default: "",
      trim: true,
    },

    houseNo: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// ORDER SCHEMA
// =====================================================

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },


    // ================= ORDER PRODUCTS =================

    orderItems: {
      type: [orderItemSchema],

      validate: {
        validator: function (items) {
          return Array.isArray(items) && items.length > 0;
        },

        message: "Order must contain at least one item",
      },
    },


    // ================= SHIPPING ADDRESS =================

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },


    // ================= PAYMENT =================

    paymentMethod: {
      type: String,

      enum: [
        "COD",
        "Razorpay",
        "Stripe",
      ],

      default: "COD",
      required: true,
    },


    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],

      default: "pending",
    },


    paymentId: {
      type: String,
      default: "",
      trim: true,
    },


    // ================= COUPON =================

    couponCode: {
      type: String,
      default: "",
      trim: true,
    },


    // ================= PRICE DETAILS =================

    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },


    shippingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    discountPrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },


    // ================= ORDER STATUS =================

    orderStatus: {
      type: String,

      enum: [
        "placed",
        "packed",
        "shipped",
        "out for delivery",
        "delivered",
        "cancelled",
      ],

      default: "placed",
      index: true,
    },


    // ================= TRACKING =================

    trackingId: {
      type: String,
      default: "",
      trim: true,
    },


    estimatedDelivery: {
      type: Date,
      default: null,
    },


    deliveredAt: {
      type: Date,
      default: null,
    },


    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// =====================================================
// INDEXES
// =====================================================

orderSchema.index({
  user: 1,
  createdAt: -1,
});

orderSchema.index({
  orderStatus: 1,
  createdAt: -1,
});


// =====================================================
// MODEL
// =====================================================

const Order = mongoose.model(
  "Order",
  orderSchema
);


module.exports = Order;