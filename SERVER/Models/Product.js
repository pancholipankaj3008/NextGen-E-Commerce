const mongoose = require("mongoose");


// =====================================================
// SIZE + STOCK SCHEMA
// =====================================================

const sizeStockSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sku: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// PRODUCT VARIANT SCHEMA
// =====================================================

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
    },

    images: [
      {
        type: String,
      },
    ],

    sizes: {
      type: [sizeStockSchema],
      default: [],
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// CATEGORY-SPECIFIC ATTRIBUTES
// =====================================================

const attributeSchema = new mongoose.Schema(
  {
    // COMMON CLOTHING

    fabric: {
      type: String,
      trim: true,
    },

    material: {
      type: String,
      trim: true,
    },

    fitType: {
      type: String,
      trim: true,
    },

    pattern: {
      type: String,
      trim: true,
    },

    occasion: {
      type: String,
      trim: true,
    },

    length: {
      type: String,
      trim: true,
    },


    // TOP WEAR

    sleeveType: {
      type: String,
      trim: true,
    },

    neckType: {
      type: String,
      trim: true,
    },

    collarType: {
      type: String,
      trim: true,
    },

    shirtType: {
      type: String,
      trim: true,
    },

    topType: {
      type: String,
      trim: true,
    },

    hoodieType: {
      type: String,
      trim: true,
    },

    jacketType: {
      type: String,
      trim: true,
    },


    // BOTTOM WEAR

    waistRise: {
      type: String,
      trim: true,
    },

    stretchable: {
      type: Boolean,
    },

    washType: {
      type: String,
      trim: true,
    },

    jeansFit: {
      type: String,
      trim: true,
    },

    trouserType: {
      type: String,
      trim: true,
    },

    shortsType: {
      type: String,
      trim: true,
    },


    // WOMEN WEAR

    dressType: {
      type: String,
      trim: true,
    },

    skirtType: {
      type: String,
      trim: true,
    },

    kurtaType: {
      type: String,
      trim: true,
    },


    // FOOTWEAR

    shoeType: {
      type: String,
      trim: true,
    },

    soleMaterial: {
      type: String,
      trim: true,
    },

    upperMaterial: {
      type: String,
      trim: true,
    },

    closureType: {
      type: String,
      trim: true,
    },

    toeShape: {
      type: String,
      trim: true,
    },

    cushioning: {
      type: String,
      trim: true,
    },

    ankleHeight: {
      type: String,
      trim: true,
    },

    heelType: {
      type: String,
      trim: true,
    },

    heelHeight: {
      type: String,
      trim: true,
    },


    // BAGS

    bagType: {
      type: String,
      trim: true,
    },

    compartmentCount: {
      type: Number,
      min: 0,
    },

    laptopCompatible: {
      type: Boolean,
    },


    // CAPS

    capType: {
      type: String,
      trim: true,
    },

    adjustable: {
      type: Boolean,
    },


    // ACCESSORIES

    accessoryType: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);


// =====================================================
// CATEGORY ATTRIBUTE RULES
// =====================================================

const CATEGORY_ATTRIBUTE_MAP = {
  "T-Shirts": [
    "fabric",
    "fitType",
    "sleeveType",
    "neckType",
    "pattern",
    "occasion",
  ],

  Shirts: [
    "fabric",
    "fitType",
    "sleeveType",
    "collarType",
    "shirtType",
    "pattern",
    "occasion",
  ],

  Jeans: [
    "material",
    "jeansFit",
    "waistRise",
    "stretchable",
    "washType",
    "pattern",
  ],

  Trousers: [
    "fabric",
    "fitType",
    "waistRise",
    "stretchable",
    "trouserType",
    "occasion",
  ],

  Hoodies: [
    "fabric",
    "fitType",
    "sleeveType",
    "hoodieType",
    "pattern",
  ],

  Jackets: [
    "material",
    "fitType",
    "sleeveType",
    "jacketType",
    "closureType",
    "occasion",
  ],

  Shorts: [
    "fabric",
    "fitType",
    "waistRise",
    "stretchable",
    "shortsType",
  ],

  Tracks: [
    "fabric",
    "fitType",
    "waistRise",
    "stretchable",
  ],

  Sweaters: [
    "fabric",
    "fitType",
    "sleeveType",
    "neckType",
    "pattern",
  ],

  Dresses: [
    "fabric",
    "dressType",
    "sleeveType",
    "neckType",
    "pattern",
    "occasion",
    "length",
  ],

  Tops: [
    "fabric",
    "topType",
    "fitType",
    "sleeveType",
    "neckType",
    "pattern",
    "occasion",
  ],

  Skirts: [
    "fabric",
    "skirtType",
    "waistRise",
    "pattern",
    "length",
    "occasion",
  ],

  Kurtas: [
    "fabric",
    "kurtaType",
    "fitType",
    "sleeveType",
    "neckType",
    "pattern",
    "occasion",
    "length",
  ],

  Shoes: [
    "shoeType",
    "upperMaterial",
    "soleMaterial",
    "closureType",
    "toeShape",
    "cushioning",
    "ankleHeight",
    "occasion",
  ],

  Sneakers: [
    "shoeType",
    "upperMaterial",
    "soleMaterial",
    "closureType",
    "toeShape",
    "cushioning",
    "ankleHeight",
  ],

  Sandals: [
    "upperMaterial",
    "soleMaterial",
    "closureType",
    "toeShape",
    "heelType",
    "heelHeight",
    "occasion",
  ],

  Slippers: [
    "upperMaterial",
    "soleMaterial",
    "toeShape",
    "occasion",
  ],

  Bags: [
    "material",
    "bagType",
    "closureType",
    "compartmentCount",
    "laptopCompatible",
    "occasion",
  ],

  Caps: [
    "material",
    "capType",
    "adjustable",
    "pattern",
    "occasion",
  ],

  Accessories: [
    "material",
    "accessoryType",
    "pattern",
    "occasion",
  ],
};


// =====================================================
// CATEGORY SIZE RULES
// =====================================================

const CATEGORY_SIZE_MAP = {
  "T-Shirts": [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Shirts: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Hoodies: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Jackets: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Sweaters: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Dresses: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Tops: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Kurtas: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],


  Jeans: [
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
  ],

  Trousers: [
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
    "42",
  ],

  Shorts: [
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
  ],

  Tracks: [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ],

  Skirts: [
    "26",
    "28",
    "30",
    "32",
    "34",
    "36",
    "38",
    "40",
  ],


  Shoes: [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],

  Sneakers: [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],

  Sandals: [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],

  Slippers: [
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],


  Bags: [
    "Free Size",
  ],

  Caps: [
    "Free Size",
  ],

  Accessories: [
    "Free Size",
  ],
};


// =====================================================
// MAIN PRODUCT SCHEMA
// =====================================================

const productSchema = new mongoose.Schema(
  {
    // BASIC INFORMATION

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      default: "NextGen",
      trim: true,
    },


    // CLASSIFICATION

    category: {
      type: String,
      required: true,

      enum: [
        "T-Shirts",
        "Shirts",
        "Jeans",
        "Trousers",
        "Hoodies",
        "Jackets",
        "Shorts",
        "Tracks",
        "Sweaters",

        "Dresses",
        "Tops",
        "Skirts",
        "Kurtas",

        "Shoes",
        "Sneakers",
        "Sandals",
        "Slippers",

        "Bags",
        "Caps",
        "Accessories",
      ],
    },

    gender: {
      type: String,
      required: true,

      enum: [
        "Men",
        "Women",
        "Unisex",
        "Kids",
      ],
    },


    // PRICE

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    finalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },


    // PRODUCT IMAGES

    images: {
      type: [String],
      default: [],
    },


    // COLOR + SIZE VARIANTS

    variants: {
      type: [variantSchema],
      default: [],
    },


    // CATEGORY ATTRIBUTES

    attributes: {
      type: attributeSchema,
      default: () => ({}),
    },


    // TAGS

    tags: {
      type: [String],
      default: [],
    },


    // COLLECTION

    collection: {
      type: String,

      enum: [
        "Summer Collection",
        "Winter Drop",
        "Streetwear Collection",
        "Limited Edition",
      ],
    },


    // POLICIES

    returnPolicy: {
      type: String,
      default: "7 Days Easy Return",
      trim: true,
    },

    careInstructions: {
      type: [String],
      default: [],
    },


    // ANALYTICS

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalStock: {
      type: Number,
      default: 0,
      min: 0,
    },


    // FLAGS

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isTrending: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },


    // SOFT DELETE

    deletedAt: {
      type: Date,
      default: null,
    },


    // BASE SKU

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


// =====================================================
// VALIDATE CATEGORY SIZES
// =====================================================

productSchema.pre("validate", function () {
  const allowedSizes =
    CATEGORY_SIZE_MAP[this.category] || [];

  for (const variant of this.variants || []) {
    for (const item of variant.sizes || []) {
      if (
        allowedSizes.length > 0 &&
        !allowedSizes.includes(String(item.size))
      ) {
        throw new Error(
          `Size ${item.size} is not valid for category ${this.category}`
        );
      }
    }
  }
});


// =====================================================
// CLEAN ATTRIBUTES
// =====================================================

productSchema.pre("save", function () {
  const allowedAttributes =
    CATEGORY_ATTRIBUTE_MAP[this.category] || [];

  if (this.attributes) {
    const currentAttributes =
      this.attributes.toObject
        ? this.attributes.toObject()
        : this.attributes;

    const cleanedAttributes = {};

    for (const key of allowedAttributes) {
      const value = currentAttributes[key];

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        cleanedAttributes[key] = value;
      }
    }

    this.attributes = cleanedAttributes;
  }


  // FINAL PRICE

  const price =
    Number(this.price || 0);

  const discount =
    Number(this.discountPercent || 0);

  this.finalPrice = Math.max(
    0,
    Math.round(
      price -
      (price * discount) / 100
    )
  );


  // TOTAL STOCK

  this.totalStock =
    (this.variants || []).reduce(
      (variantTotal, variant) => {
        const sizeStock =
          (variant.sizes || []).reduce(
            (total, item) =>
              total +
              Number(item.stock || 0),
            0
          );

        return variantTotal + sizeStock;
      },
      0
    );
});


// =====================================================
// EXPORT CATEGORY CONFIGS FOR CONTROLLER
// =====================================================

productSchema.statics.CATEGORY_ATTRIBUTE_MAP =
  CATEGORY_ATTRIBUTE_MAP;

productSchema.statics.CATEGORY_SIZE_MAP =
  CATEGORY_SIZE_MAP;


// =====================================================
// MODEL
// =====================================================

const Product = mongoose.model(
  "Product",
  productSchema
);

module.exports = Product;