const Cart = require("../Models/Cart");
const Product = require("../Models/Product");


function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function getProductPrice(product) {
  return Number(
    product.finalPrice ??
    product.price ??
    0
  );
}


function calculateCart(cart) {
  let subtotal = 0;
  let totalQuantity = 0;

  for (const item of cart.items || []) {
    const product = item.product;

    if (!product) {
      continue;
    }

    const price = getProductPrice(product);

    subtotal +=
      price * Number(item.quantity || 0);

    totalQuantity +=
      Number(item.quantity || 0);
  }

  return {
    subtotal,
    totalQuantity,
  };
}


// =====================================================
// ADD TO CART
// =====================================================

async function AddToCart(req, res) {
  try {
    let {
      productId,
      color,
      size,
      quantity,
    } = req.body;


    quantity = Number(quantity);


    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }


    if (!color) {
      return res.status(400).json({
        success: false,
        message: "Please select a color",
      });
    }


    if (!size) {
      return res.status(400).json({
        success: false,
        message: "Please select a size",
      });
    }


    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }


    const product = await Product.findOne({
      _id: productId,
      isActive: true,
      deletedAt: null,
    });


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    const selectedVariant =
      product.variants.find(
        (variant) =>
          normalize(variant.color) ===
          normalize(color)
      );


    if (!selectedVariant) {
      return res.status(400).json({
        success: false,
        message: "Selected color is not available",
      });
    }


    const selectedSize =
      selectedVariant.sizes.find(
        (item) =>
          normalize(item.size) ===
          normalize(size)
      );


    if (!selectedSize) {
      return res.status(400).json({
        success: false,
        message: "Selected size is not available",
      });
    }


    if (
      Number(selectedSize.stock || 0) <
      quantity
    ) {
      return res.status(400).json({
        success: false,
        message: `Only ${selectedSize.stock} item(s) available in stock`,
      });
    }


    let cart = await Cart.findOne({
      user: req.id,
    });


    if (!cart) {
      cart = new Cart({
        user: req.id,
        items: [],
      });
    }


    const existingItem =
      cart.items.find(
        (item) =>
          String(item.product) ===
            String(productId) &&

          normalize(item.color) ===
            normalize(selectedVariant.color) &&

          normalize(item.size) ===
            normalize(selectedSize.size)
      );


    if (existingItem) {
      const newQuantity =
        Number(existingItem.quantity) +
        quantity;


      if (
        Number(selectedSize.stock || 0) <
        newQuantity
      ) {
        return res.status(400).json({
          success: false,
          message: `Only ${selectedSize.stock} item(s) available in stock`,
        });
      }


      existingItem.quantity =
        newQuantity;

      existingItem.price =
        getProductPrice(product);
    } else {
      cart.items.push({
        product: product._id,

        color:
          selectedVariant.color,

        size:
          selectedSize.size,

        quantity,

        price:
          getProductPrice(product),
      });
    }


    await cart.save();


    const populatedCart =
      await Cart.findById(cart._id)
        .populate("items.product");


    const {
      subtotal,
      totalQuantity,
    } = calculateCart(populatedCart);


    return res.status(200).json({
      success: true,

      message:
        "Product added to cart",

      cart: populatedCart,

      subtotal,

      totalQuantity,
    });

  } catch (error) {
    console.error(
      "AddToCart Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to add product to cart",
    });
  }
}


// =====================================================
// GET MY CART
// =====================================================

async function GetMyCart(req, res) {
  try {
    const cart =
      await Cart.findOne({
        user: req.id,
      })
        .populate({
          path: "items.product",

          match: {
            isActive: true,
            deletedAt: null,
          },
        });


    if (!cart) {
      return res.status(200).json({
        success: true,

        cart: {
          items: [],
        },

        subtotal: 0,

        totalQuantity: 0,
      });
    }


    // Remove references to deleted/inactive products

    const invalidItems =
      cart.items.filter(
        (item) => !item.product
      );


    if (invalidItems.length > 0) {
      cart.items =
        cart.items.filter(
          (item) => item.product
        );

      await cart.save();
    }


    const {
      subtotal,
      totalQuantity,
    } = calculateCart(cart);


    return res.status(200).json({
      success: true,

      cart,

      subtotal,

      totalQuantity,
    });

  } catch (error) {
    console.error(
      "GetMyCart Error:",
      error
    );


    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch cart",
    });
  }
}


// =====================================================
// UPDATE CART ITEM
// =====================================================

async function UpdateCartItem(req, res) {
  try {
    const {
      cartItemId,
    } = req.params;


    let {
      quantity,
    } = req.body;


    quantity = Number(quantity);


    if (
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Quantity must be at least 1",
      });
    }


    const cart =
      await Cart.findOne({
        user: req.id,
      }).populate("items.product");


    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }


    const cartItem =
      cart.items.id(cartItemId);


    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }


    const product =
      cartItem.product;


    if (
      !product ||
      product.isActive === false ||
      product.deletedAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This product is no longer available",
      });
    }


    const selectedVariant =
      product.variants.find(
        (variant) =>
          normalize(variant.color) ===
          normalize(cartItem.color)
      );


    if (!selectedVariant) {
      return res.status(400).json({
        success: false,
        message:
          "Selected product color is no longer available",
      });
    }


    const selectedSize =
      selectedVariant.sizes.find(
        (item) =>
          normalize(item.size) ===
          normalize(cartItem.size)
      );


    if (!selectedSize) {
      return res.status(400).json({
        success: false,
        message:
          "Selected size is no longer available",
      });
    }


    if (
      Number(selectedSize.stock || 0) <
      quantity
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Only ${selectedSize.stock} item(s) available in stock`,
      });
    }


    cartItem.quantity =
      quantity;

    cartItem.price =
      getProductPrice(product);


    await cart.save();


    const refreshedCart =
      await Cart.findById(cart._id)
        .populate("items.product");


    const {
      subtotal,
      totalQuantity,
    } = calculateCart(refreshedCart);


    return res.status(200).json({
      success: true,

      message:
        "Cart updated successfully",

      cart:
        refreshedCart,

      subtotal,

      totalQuantity,
    });

  } catch (error) {
    console.error(
      "UpdateCartItem Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to update cart",
    });
  }
}


// =====================================================
// REMOVE CART ITEM
// =====================================================

async function RemoveCartItem(req, res) {
  try {
    const {
      cartItemId,
    } = req.params;


    const cart =
      await Cart.findOne({
        user: req.id,
      });


    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }


    const cartItem =
      cart.items.id(cartItemId);


    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }


    cart.items.pull(
      cartItemId
    );


    await cart.save();


    const populatedCart =
      await Cart.findById(cart._id)
        .populate("items.product");


    const {
      subtotal,
      totalQuantity,
    } = calculateCart(populatedCart);


    return res.status(200).json({
      success: true,

      message:
        "Item removed from cart",

      cart:
        populatedCart,

      subtotal,

      totalQuantity,
    });

  } catch (error) {
    console.error(
      "RemoveCartItem Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to remove cart item",
    });
  }
}


// =====================================================
// CLEAR CART
// =====================================================

async function ClearCart(req, res) {
  try {
    const cart =
      await Cart.findOne({
        user: req.id,
      });


    if (!cart) {
      return res.status(200).json({
        success: true,

        message:
          "Cart is already empty",

        cart: {
          items: [],
        },

        subtotal: 0,

        totalQuantity: 0,
      });
    }


    cart.items = [];


    await cart.save();


    return res.status(200).json({
      success: true,

      message:
        "Cart cleared successfully",

      cart,

      subtotal: 0,

      totalQuantity: 0,
    });

  } catch (error) {
    console.error(
      "ClearCart Error:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to clear cart",
    });
  }
}


module.exports = {
  AddToCart,
  GetMyCart,
  UpdateCartItem,
  RemoveCartItem,
  ClearCart,
};