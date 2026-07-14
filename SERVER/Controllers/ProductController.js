const Product = require("../Models/Product");
const cloudinary = require("../Config/cloudinaryConfig");
const streamifier = require("streamifier");
const slugify = require("slugify");
const mongoose = require("mongoose");


// =====================================================
// HELPERS
// =====================================================

function parseJSON(value, fallback = []) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}


function parseBoolean(value, fallback = false) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).toLowerCase() === "true";
}


function escapeRegex(value = "") {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


function normalizeVariants(variants = []) {
  if (!Array.isArray(variants)) {
    return [];
  }

  return variants.map((variant) => ({
    color: String(variant.color || "").trim(),

    images: Array.isArray(variant.images)
      ? variant.images.filter(Boolean)
      : [],

    sizes: Array.isArray(variant.sizes)
      ? variant.sizes.map((item) => ({
          size: String(item.size || "").trim(),

          stock: Math.max(
            0,
            Number(item.stock || 0)
          ),

          sku: item.sku
            ? String(item.sku).trim()
            : undefined,
        }))
      : [],
  }));
}


function calculateTotalStock(variants = []) {
  return variants.reduce(
    (variantTotal, variant) => {
      const variantStock = (
        variant.sizes || []
      ).reduce(
        (sizeTotal, item) =>
          sizeTotal +
          Number(item.stock || 0),
        0
      );

      return variantTotal + variantStock;
    },
    0
  );
}


function getProductImages(variants = []) {
  return [
    ...new Set(
      variants.flatMap(
        (variant) =>
          variant.images || []
      )
    ),
  ];
}


function createSKU() {
  return `SKU-${Date.now()}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}


// =====================================================
// CATEGORY ATTRIBUTE FILTER
// =====================================================

function cleanAttributes(category, attributes = {}) {
  const categoryMap =
    Product.CATEGORY_ATTRIBUTE_MAP || {};

  const allowedFields =
    categoryMap[category] || [];

  const cleaned = {};

  for (const field of allowedFields) {
    const value = attributes[field];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      cleaned[field] = value;
    }
  }

  return cleaned;
}


// =====================================================
// CATEGORY SIZE VALIDATION
// =====================================================

function validateVariantSizes(category, variants = []) {
  const sizeMap =
    Product.CATEGORY_SIZE_MAP || {};

  const allowedSizes =
    sizeMap[category] || [];

  if (!allowedSizes.length) {
    return {
      valid: true,
    };
  }

  for (const variant of variants) {
    for (const sizeItem of variant.sizes || []) {
      const currentSize =
        String(sizeItem.size);

      if (!allowedSizes.includes(currentSize)) {
        return {
          valid: false,

          message:
            `Size "${currentSize}" is not valid for ${category}. ` +
            `Allowed sizes: ${allowedSizes.join(", ")}`,
        };
      }
    }
  }

  return {
    valid: true,
  };
}


// =====================================================
// VARIANT VALIDATION
// =====================================================

function validateVariants(variants = []) {
  if (!Array.isArray(variants) || !variants.length) {
    return {
      valid: false,
      message:
        "At least one product variant is required",
    };
  }

  for (const variant of variants) {
    if (!variant.color?.trim()) {
      return {
        valid: false,
        message:
          "Color is required for every variant",
      };
    }

    if (
      !Array.isArray(variant.sizes) ||
      variant.sizes.length === 0
    ) {
      return {
        valid: false,
        message:
          `At least one size is required for color ${variant.color}`,
      };
    }

    for (const sizeItem of variant.sizes) {
      if (!sizeItem.size) {
        return {
          valid: false,
          message:
            `Size is required for color ${variant.color}`,
        };
      }

      if (
        Number.isNaN(Number(sizeItem.stock)) ||
        Number(sizeItem.stock) < 0
      ) {
        return {
          valid: false,
          message:
            `Invalid stock for ${variant.color} / ${sizeItem.size}`,
        };
      }
    }
  }

  return {
    valid: true,
  };
}


// =====================================================
// UNIQUE SLUG
// =====================================================

async function createUniqueSlug(
  title,
  excludeId = null
) {
  const baseSlug =
    slugify(title, {
      lower: true,
      strict: true,
      trim: true,
    }) || `product-${Date.now()}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = {
      slug,
    };

    if (excludeId) {
      query._id = {
        $ne: excludeId,
      };
    }

    const exists =
      await Product.exists(query);

    if (!exists) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;

    counter++;
  }
}


// =====================================================
// CLOUDINARY
// =====================================================

function uploadImage(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder:
            "clothing-brand-products",

          resource_type: "image",
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(stream);
  });
}


async function uploadVariantImages(files = []) {
  const urls = [];

  for (const file of files) {
    const result =
      await uploadImage(file.buffer);

    urls.push(result.secure_url);
  }

  return urls;
}


// =====================================================
// PROCESS VARIANT IMAGES
// =====================================================

async function processVariantImages(
  variants,
  files = [],
  existingVariants = []
) {
  const processedVariants = [];

  for (
    let index = 0;
    index < variants.length;
    index++
  ) {
    const variant = variants[index];

    const variantFiles =
      files.filter(
        (file) =>
          file.fieldname ===
          `variantImages_${index}`
      );

    let images = [];

    if (variantFiles.length > 0) {
      images =
        await uploadVariantImages(
          variantFiles
        );
    } else if (
      Array.isArray(variant.images) &&
      variant.images.length > 0
    ) {
      images = variant.images;
    } else if (
      existingVariants[index] &&
      Array.isArray(
        existingVariants[index].images
      )
    ) {
      images =
        existingVariants[index].images;
    }

    processedVariants.push({
      color: variant.color,

      images,

      sizes: (variant.sizes || []).map(
        (item) => ({
          size: String(item.size),

          stock: Math.max(
            0,
            Number(item.stock || 0)
          ),

          sku: item.sku || undefined,
        })
      ),
    });
  }

  return processedVariants;
}


// =====================================================
// ADD PRODUCT
// =====================================================

async function AddProduct(req, res) {
  try {
    const {
      title,
      description,
      shortDescription,
      brand,
      category,
      gender,

      price,
      discountPercent,

      collection,
      returnPolicy,

      attributes,
      tags,
      careInstructions,
      variants,

      isFeatured,
      isNewArrival,
      isTrending,
    } = req.body;


    // BASIC VALIDATION

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product title is required",
      });
    }


    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Product description is required",
      });
    }


    if (!category) {
      return res.status(400).json({
        success: false,
        message:
          "Product category is required",
      });
    }


    if (!gender) {
      return res.status(400).json({
        success: false,
        message:
          "Product gender is required",
      });
    }


    if (
      price === undefined ||
      price === "" ||
      Number.isNaN(Number(price)) ||
      Number(price) < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid product price is required",
      });
    }


    const escapedTitle =
      escapeRegex(title.trim());


    const existingProduct =
      await Product.findOne({
        title: {
          $regex:
            `^${escapedTitle}$`,

          $options: "i",
        },

        isActive: true,
      });


    if (existingProduct) {
      return res.status(409).json({
        success: false,

        message:
          "Product with this title already exists",
      });
    }


    // PARSE VARIANTS

    let parsedVariants =
      normalizeVariants(
        parseJSON(variants, [])
      );


    const variantValidation =
      validateVariants(parsedVariants);


    if (!variantValidation.valid) {
      return res.status(400).json({
        success: false,

        message:
          variantValidation.message,
      });
    }


    // CATEGORY SIZE VALIDATION

    const sizeValidation =
      validateVariantSizes(
        category,
        parsedVariants
      );


    if (!sizeValidation.valid) {
      return res.status(400).json({
        success: false,

        message:
          sizeValidation.message,
      });
    }


    // PROCESS IMAGES

    parsedVariants =
      await processVariantImages(
        parsedVariants,
        req.files || []
      );


    const hasImages =
      parsedVariants.some(
        (variant) =>
          Array.isArray(
            variant.images
          ) &&
          variant.images.length > 0
      );


    if (!hasImages) {
      return res.status(400).json({
        success: false,

        message:
          "Please upload at least one product image",
      });
    }


    // CLEAN ATTRIBUTES

    const parsedAttributes =
      parseJSON(attributes, {});


    const cleanedAttributes =
      cleanAttributes(
        category,
        parsedAttributes
      );


    // SLUG

    const slug =
      await createUniqueSlug(
        title.trim()
      );


    // SKU

    let sku = createSKU();

    while (
      await Product.exists({ sku })
    ) {
      sku = createSKU();
    }


    // CREATE

    const newProduct =
      new Product({
        title: title.trim(),

        slug,

        description:
          description.trim(),

        shortDescription:
          shortDescription?.trim() || "",

        brand:
          brand?.trim() || "NextGen",

        category,

        gender,

        price: Number(price),

        discountPercent:
          Number(discountPercent || 0),

        attributes:
          cleanedAttributes,

        variants:
          parsedVariants,

        images:
          getProductImages(
            parsedVariants
          ),

        tags:
          parseJSON(tags, []),

        collection:
          collection || undefined,

        returnPolicy:
          returnPolicy ||
          "7 Days Easy Return",

        careInstructions:
          parseJSON(
            careInstructions,
            []
          ),

        isFeatured:
          parseBoolean(isFeatured),

        isNewArrival:
          parseBoolean(isNewArrival),

        isTrending:
          parseBoolean(isTrending),

        sku,
      });


    await newProduct.save();


    return res.status(201).json({
      success: true,

      message:
        "Product Added Successfully",

      product: newProduct,
    });

  } catch (error) {
    console.error(
      "ADD PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error Adding Product",
    });
  }
}


// =====================================================
// GET ALL PRODUCTS
// =====================================================

async function GetAllProducts(req, res) {
  try {
    const {
      search,

      category,
      gender,
      collection,
      brand,

      fitType,
      fabric,
      material,
      sleeveType,
      neckType,
      shirtType,
      jeansFit,
      shoeType,

      minPrice,
      maxPrice,

      isFeatured,
      isNewArrival,
      isTrending,

      sort,

      page = 1,
      limit = 10,
    } = req.query;


    const query = {
      isActive: true,
    };


    // SEARCH

    if (search?.trim()) {
      const safeSearch =
        escapeRegex(search.trim());

      query.$or = [
        {
          title: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          brand: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          category: {
            $regex: safeSearch,
            $options: "i",
          },
        },

        {
          tags: {
            $regex: safeSearch,
            $options: "i",
          },
        },
      ];
    }


    // BASIC FILTERS

    if (category) {
      query.category = category;
    }

    if (gender) {
      query.gender = gender;
    }

    if (collection) {
      query.collection = collection;
    }

    if (brand) {
      query.brand = brand;
    }


    // ATTRIBUTE FILTERS

    const attributeFilters = {
      fitType,
      fabric,
      material,
      sleeveType,
      neckType,
      shirtType,
      jeansFit,
      shoeType,
    };


    Object.entries(
      attributeFilters
    ).forEach(([key, value]) => {
      if (value) {
        query[`attributes.${key}`] =
          value;
      }
    });


    // FLAGS

    if (isFeatured !== undefined) {
      query.isFeatured =
        parseBoolean(isFeatured);
    }

    if (isNewArrival !== undefined) {
      query.isNewArrival =
        parseBoolean(isNewArrival);
    }

    if (isTrending !== undefined) {
      query.isTrending =
        parseBoolean(isTrending);
    }


    // PRICE

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      query.finalPrice = {};

      if (minPrice !== undefined) {
        query.finalPrice.$gte =
          Number(minPrice);
      }

      if (maxPrice !== undefined) {
        query.finalPrice.$lte =
          Number(maxPrice);
      }
    }


    // SORT

    let sortOption = {
      createdAt: -1,
    };

    switch (sort) {
      case "lowToHigh":
        sortOption = {
          finalPrice: 1,
        };
        break;

      case "highToLow":
        sortOption = {
          finalPrice: -1,
        };
        break;

      case "popular":
        sortOption = {
          soldCount: -1,
          views: -1,
        };
        break;

      case "rating":
        sortOption = {
          ratings: -1,
        };
        break;

      default:
        sortOption = {
          createdAt: -1,
        };
    }


    const currentPage =
      Math.max(
        1,
        Number(page) || 1
      );


    const pageLimit =
      Math.min(
        100,
        Math.max(
          1,
          Number(limit) || 10
        )
      );


    const skip =
      (currentPage - 1) *
      pageLimit;


    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(pageLimit),

      Product.countDocuments(query),
    ]);


    return res.status(200).json({
      success: true,

      totalProducts,

      currentPage,

      totalPages:
        Math.ceil(
          totalProducts /
          pageLimit
        ),

      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// GET SINGLE PRODUCT
// =====================================================

// =====================================================
// GET SINGLE PRODUCT (ID ya SLUG dono support)
// =====================================================

async function GetSingleProduct(req, res) {
  try {
    const { id } = req.params;   // yahan 'id' naam hai lekin slug bhi aa sakta hai

    let product;

    // Agar valid MongoDB ID hai to findById use karo
    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findOneAndUpdate(
        { _id: id, isActive: true },
        { $inc: { views: 1 } },
        { new: true }
      );
    } 
    // Warna slug se dhoondho
    else {
      product = await Product.findOneAndUpdate(
        { slug: id, isActive: true },
        { $inc: { views: 1 } },
        { new: true }
      );
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    console.error("Get Single Product Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
}

// =====================================================
// UPDATE PRODUCT
// =====================================================

async function UpdateProduct(req, res) {
  try {
    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }


    const product =
      await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    const finalCategory =
      req.body.category ||
      product.category;


    // VARIANTS

    let parsedVariants;

    if (
      req.body.variants !== undefined
    ) {
      parsedVariants =
        normalizeVariants(
          parseJSON(
            req.body.variants,
            []
          )
        );
    } else {
      parsedVariants =
        product.variants.map(
          (variant) =>
            variant.toObject
              ? variant.toObject()
              : variant
        );
    }


    const variantValidation =
      validateVariants(
        parsedVariants
      );


    if (!variantValidation.valid) {
      return res.status(400).json({
        success: false,

        message:
          variantValidation.message,
      });
    }


    // SIZE VALIDATION

    const sizeValidation =
      validateVariantSizes(
        finalCategory,
        parsedVariants
      );


    if (!sizeValidation.valid) {
      return res.status(400).json({
        success: false,

        message:
          sizeValidation.message,
      });
    }


    // IMAGES

    parsedVariants =
      await processVariantImages(
        parsedVariants,
        req.files || [],
        product.variants
      );


    const hasImages =
      parsedVariants.some(
        (variant) =>
          variant.images?.length > 0
      );


    if (!hasImages) {
      return res.status(400).json({
        success: false,

        message:
          "Product must have at least one image",
      });
    }


    // TITLE

    if (
      req.body.title !== undefined &&
      req.body.title.trim() !==
        product.title
    ) {
      product.title =
        req.body.title.trim();

      product.slug =
        await createUniqueSlug(
          product.title,
          id
        );
    }


    // BASIC FIELDS

    if (
      req.body.description !==
      undefined
    ) {
      product.description =
        req.body.description.trim();
    }


    if (
      req.body.shortDescription !==
      undefined
    ) {
      product.shortDescription =
        req.body.shortDescription.trim();
    }


    if (
      req.body.brand !== undefined
    ) {
      product.brand =
        req.body.brand.trim();
    }


    if (
      req.body.gender !== undefined
    ) {
      product.gender =
        req.body.gender;
    }


    product.category =
      finalCategory;


    // PRICE

    if (
      req.body.price !== undefined
    ) {
      product.price =
        Number(req.body.price);
    }


    if (
      req.body.discountPercent !==
      undefined
    ) {
      product.discountPercent =
        Number(
          req.body.discountPercent
        );
    }


    // COLLECTION

    if (
      req.body.collection !==
      undefined
    ) {
      product.collection =
        req.body.collection || undefined;
    }


    // RETURN POLICY

    if (
      req.body.returnPolicy !==
      undefined
    ) {
      product.returnPolicy =
        req.body.returnPolicy;
    }


    // ATTRIBUTES

    if (
      req.body.attributes !==
      undefined
    ) {
      const incomingAttributes =
        parseJSON(
          req.body.attributes,
          {}
        );

      product.attributes =
        cleanAttributes(
          finalCategory,
          incomingAttributes
        );
    } else if (
      req.body.category !==
      undefined &&
      req.body.category !==
        product.category
    ) {
      product.attributes = {};
    } else {
      const existingAttributes =
        product.attributes?.toObject
          ? product.attributes.toObject()
          : product.attributes || {};

      product.attributes =
        cleanAttributes(
          finalCategory,
          existingAttributes
        );
    }


    // TAGS

    if (
      req.body.tags !== undefined
    ) {
      product.tags =
        parseJSON(
          req.body.tags,
          []
        );
    }


    // CARE

    if (
      req.body.careInstructions !==
      undefined
    ) {
      product.careInstructions =
        parseJSON(
          req.body.careInstructions,
          []
        );
    }


    // FLAGS

    const booleanFields = [
      "isFeatured",
      "isNewArrival",
      "isTrending",
      "isActive",
    ];


    booleanFields.forEach((key) => {
      if (
        req.body[key] !== undefined
      ) {
        product[key] =
          parseBoolean(
            req.body[key]
          );
      }
    });


    // VARIANTS + IMAGES

    product.variants =
      parsedVariants;

    product.images =
      getProductImages(
        parsedVariants
      );

    product.totalStock =
      calculateTotalStock(
        parsedVariants
      );


    // IMPORTANT:
    // save() use kar rahe hain taaki
    // Product schema middleware chale

    await product.save();


    return res.status(200).json({
      success: true,

      message:
        "Product Updated Successfully",

      product,
    });

  } catch (error) {
    console.error(
      "UPDATE PRODUCT ERROR:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Error Updating Product",
    });
  }
}


// =====================================================
// DELETE PRODUCT
// =====================================================

async function DeleteProduct(req, res) {
  try {
    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }


    const product =
      await Product.findById(id);


    if (!product) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    if (!product.isActive) {
      return res.status(400).json({
        success: false,

        message:
          "Product already deleted",
      });
    }


    product.isActive = false;

    product.deletedAt =
      new Date();


    await product.save();


    return res.status(200).json({
      success: true,

      message:
        "Product Deleted Successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// FEATURED PRODUCTS
// =====================================================

async function FeaturedProducts(req, res) {
  try {
    const products =
      await Product.find({
        isFeatured: true,
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .limit(20);


    return res.status(200).json({
      success: true,

      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// TRENDING PRODUCTS
// =====================================================

async function TrendingProducts(req, res) {
  try {
    const products =
      await Product.find({
        isTrending: true,
        isActive: true,
      })
        .sort({
          soldCount: -1,
          views: -1,
        })
        .limit(20);


    return res.status(200).json({
      success: true,

      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// NEW ARRIVALS
// =====================================================

async function NewArrivals(req, res) {
  try {
    const products =
      await Product.find({
        isNewArrival: true,
        isActive: true,
      })
        .sort({
          createdAt: -1,
        })
        .limit(20);


    return res.status(200).json({
      success: true,

      products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// RELATED PRODUCTS
// =====================================================

async function RelatedProducts(req, res) {
  try {
    const { id } = req.params;


    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid product ID",
      });
    }


    const currentProduct =
      await Product.findById(id);


    if (!currentProduct) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    const relatedProducts =
      await Product.find({
        _id: {
          $ne: id,
        },

        isActive: true,

        $or: [
          {
            category:
              currentProduct.category,
          },

          {
            gender:
              currentProduct.gender,
          },

          ...(currentProduct.collection
            ? [
                {
                  collection:
                    currentProduct.collection,
                },
              ]
            : []),
        ],
      })
        .sort({
          ratings: -1,
          soldCount: -1,
          views: -1,
        })
        .limit(8);


    return res.status(200).json({
      success: true,

      products:
        relatedProducts,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
}


// =====================================================
// PRODUCT ANALYTICS
// =====================================================

async function ProductAnalytics(req, res) {
  try {
    const [
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredProducts,
      trendingProducts,
      newArrivalProducts,
      outOfStockProducts,
      lowStockProducts,
    ] = await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        isActive: true,
      }),

      Product.countDocuments({
        isActive: false,
      }),

      Product.countDocuments({
        isFeatured: true,
        isActive: true,
      }),

      Product.countDocuments({
        isTrending: true,
        isActive: true,
      }),

      Product.countDocuments({
        isNewArrival: true,
        isActive: true,
      }),

      Product.countDocuments({
        totalStock: 0,
        isActive: true,
      }),

      Product.countDocuments({
        totalStock: {
          $gt: 0,
          $lte: 10,
        },

        isActive: true,
      }),
    ]);


    const stockAggregation =
      await Product.aggregate([
        {
          $match: {
            isActive: true,
          },
        },

        {
          $group: {
            _id: null,

            totalInventory: {
              $sum: "$totalStock",
            },

            totalSold: {
              $sum: "$soldCount",
            },

            totalViews: {
              $sum: "$views",
            },
          },
        },
      ]);


    const stockData =
      stockAggregation[0] || {
        totalInventory: 0,
        totalSold: 0,
        totalViews: 0,
      };


    return res.status(200).json({
      success: true,

      analytics: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        featuredProducts,
        trendingProducts,
        newArrivalProducts,
        outOfStockProducts,
        lowStockProducts,

        totalInventory:
          stockData.totalInventory,

        totalSold:
          stockData.totalSold,

        totalViews:
          stockData.totalViews,
      },
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
  AddProduct,
  GetAllProducts,
  GetSingleProduct,
  UpdateProduct,
  DeleteProduct,
  FeaturedProducts,
  TrendingProducts,
  NewArrivals,
  RelatedProducts,
  ProductAnalytics,
};