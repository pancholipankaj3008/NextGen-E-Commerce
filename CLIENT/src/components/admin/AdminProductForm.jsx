import {
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  useMemo,
} from "react";


// ======================================================
// PRODUCT TYPE CONFIG (Backend Schema Compatible)
// ======================================================

export const PRODUCT_TYPE_CONFIG = {

  topwear: {
    label: "Topwear",
    categories: [
      "T-Shirts",
      "Shirts",
      "Hoodies",
      "Jackets",
      "Sweaters",
      "Tops",
      "Kurtas",
    ],
    sizes: [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],
  },

  bottomwear: {
    label: "Bottomwear",
    categories: [
      "Jeans",
      "Trousers",
      "Shorts",
      "Tracks",
      "Skirts",
    ],
    sizes: [
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
  },

  footwear: {
    label: "Footwear",
    categories: [
      "Shoes",
      "Sneakers",
      "Sandals",
      "Slippers",
    ],
    sizes: [
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
  },

  dresses: {
    label: "Dresses",
    categories: [
      "Dresses",
    ],
    sizes: [
      "XS",
      "S",
      "M",
      "L",
      "XL",
      "XXL",
    ],
  },

  accessories: {
    label: "Accessories",
    categories: [
      "Bags",
      "Caps",
      "Accessories",
    ],
    sizes: [
      "Free Size",
    ],
  },
};


// ======================================================
// CATEGORY-SPECIFIC ATTRIBUTES (Backend ke hisaab se)
// ======================================================

export const CATEGORY_ATTRIBUTES = {

  "T-Shirts": ["fabric", "fitType", "sleeveType", "neckType", "pattern", "occasion"],
  "Shirts": ["fabric", "shirtType", "fitType", "sleeveType", "collarType", "pattern", "occasion"],
  "Hoodies": ["fabric", "fitType", "sleeveType", "hoodieType", "pattern", "occasion"],
  "Jackets": ["material", "fitType", "sleeveType", "jacketType", "closureType", "occasion"],
  "Sweaters": ["fabric", "fitType", "sleeveType", "neckType", "pattern", "occasion"],
  "Tops": ["fabric", "topType", "fitType", "sleeveType", "neckType", "pattern", "occasion"],
  "Kurtas": ["fabric", "kurtaType", "fitType", "sleeveType", "neckType", "pattern", "occasion", "length"],
  "Jeans": ["material", "jeansFit", "waistRise", "stretchable", "pattern", "occasion"],
  "Trousers": ["material", "fitType", "waistRise", "stretchable", "trouserType", "occasion"],
  "Shorts": ["material", "fitType", "waistRise", "stretchable", "shortsType", "occasion"],
  "Tracks": ["material", "fitType", "waistRise", "stretchable", "occasion"],
  "Skirts": ["material", "skirtType", "waistRise", "pattern", "length", "occasion"],
  "Dresses": ["fabric", "dressType", "fitType", "sleeveType", "neckType", "pattern", "occasion", "length"],
  "Shoes": ["shoeType", "upperMaterial", "soleMaterial", "closureType", "toeShape", "heelType", "heelHeight", "occasion"],
  "Sneakers": ["shoeType", "upperMaterial", "soleMaterial", "closureType", "toeShape", "cushioning"],
  "Sandals": ["upperMaterial", "soleMaterial", "closureType", "toeShape", "heelType", "heelHeight", "occasion"],
  "Slippers": ["upperMaterial", "soleMaterial", "toeShape", "occasion"],
  "Bags": ["material", "bagType", "closureType", "occasion"],
  "Caps": ["material", "capType", "adjustable", "pattern", "occasion"],
  "Accessories": ["material", "accessoryType", "pattern", "occasion"],
};


// ======================================================
// DROPDOWN OPTIONS
// ======================================================

export const FIELD_OPTIONS = {

  gender: ["Men", "Women", "Unisex", "Kids"],

  collection: ["Summer Collection", "Winter Drop", "Streetwear Collection", "Limited Edition"],

  fabric: ["100% Cotton", "Cotton", "Cotton Blend", "Polyester", "Rayon", "Linen", "Denim"],

  material: ["Cotton", "Denim", "Polyester", "Leather", "Canvas", "Synthetic"],

  fitType: ["Regular", "Slim", "Oversized", "Relaxed", "Straight"],

  shirtType: ["Casual", "Formal", "Party", "Office Wear"],

  sleeveType: ["Half Sleeve", "Full Sleeve", "Sleeveless", "Three Quarter Sleeve"],

  neckType: ["Round Neck", "V Neck", "Crew Neck", "Polo Neck"],

  collarType: ["Spread Collar", "Button-Down Collar"],

  hoodieType: ["Pullover", "Zip-Up"],

  jacketType: ["Casual", "Bomber"],

  topType: ["Crop Top", "Tank Top"],

  kurtaType: ["Straight", "Anarkali"],

  jeansFit: ["Slim", "Straight", "Skinny"],

  waistRise: ["Low Rise", "Mid Rise", "High Rise"],

  pattern: ["Solid", "Printed", "Graphic Print", "Striped", "Floral"],

  occasion: ["Casual", "Formal", "Party", "Daily Wear", "Sports"],

  length: ["Short", "Regular", "Long", "Midi", "Maxi"],

  closureType: ["Zip", "Button", "Lace-Up", "Slip-On"],

  soleMaterial: ["Rubber", "EVA", "Leather"],

  upperMaterial: ["Leather", "Canvas", "Synthetic"],

  toeShape: ["Round Toe", "Pointed Toe"],

  heelType: ["Flat", "Block Heel"],

  dressType: ["Casual", "Party", "Maxi"],

  skirtType: ["A-Line", "Pencil"],

  shoeType: ["Sneaker", "Formal", "Sports"],

  bagType: ["Tote", "Backpack", "Handbag"],

  capType: ["Baseball", "Snapback"],

  accessoryType: ["Belt", "Wallet"],
};


// ======================================================
// ATTRIBUTE LABELS
// ======================================================

const ATTRIBUTE_LABELS = {
  fabric: "Fabric",
  material: "Material",
  fitType: "Fit Type",
  shirtType: "Shirt Type",
  sleeveType: "Sleeve Type",
  neckType: "Neck Type",
  collarType: "Collar Type",
  hoodieType: "Hoodie Type",
  jacketType: "Jacket Type",
  topType: "Top Type",
  kurtaType: "Kurta Type",
  jeansFit: "Jeans Fit",
  waistRise: "Waist Rise",
  stretchable: "Stretchable",
  pattern: "Pattern",
  occasion: "Occasion",
  length: "Length",
  closureType: "Closure Type",
  soleMaterial: "Sole Material",
  upperMaterial: "Upper Material",
  toeShape: "Toe Shape",
  heelType: "Heel Type",
  heelHeight: "Heel Height",
  dressType: "Dress Type",
  skirtType: "Skirt Type",
  shoeType: "Shoe Type",
  bagType: "Bag Type",
  capType: "Cap Type",
  accessoryType: "Accessory Type",
};


// ======================================================
// EMPTY ATTRIBUTES
// ======================================================

export const emptyAttributes = {
  fabric: "", material: "", fitType: "", shirtType: "", sleeveType: "", neckType: "",
  collarType: "", hoodieType: "", jacketType: "", topType: "", kurtaType: "",
  jeansFit: "", waistRise: "", stretchable: false, pattern: "", occasion: "",
  length: "", closureType: "", soleMaterial: "", upperMaterial: "", toeShape: "",
  heelType: "", heelHeight: "", dressType: "", skirtType: "", shoeType: "",
  bagType: "", capType: "", accessoryType: "",
};


// ======================================================
// HELPER FUNCTIONS
// ======================================================

export const createBlankVariant = (productType = "topwear") => {
  const sizes = PRODUCT_TYPE_CONFIG[productType]?.sizes || ["M"];
  return {
    color: "",
    images: [],
    sizes: [{ size: sizes[0], stock: 0, sku: "" }],
  };
};

export const createEmptyProduct = () => ({
  productType: "topwear",
  title: "",
  description: "",
  shortDescription: "",
  brand: "NextGen",
  category: "T-Shirts",
  gender: "Unisex",
  price: "",
  discountPercent: 0,
  collection: "Summer Collection",
  returnPolicy: "7 Days Easy Return",
  attributes: { ...emptyAttributes },
  variants: [createBlankVariant("topwear")],
  tags: [],
  careInstructions: [],
  isFeatured: false,
  isNewArrival: false,
  isTrending: false,
});

export function detectProductType(category) {
  for (const [type, config] of Object.entries(PRODUCT_TYPE_CONFIG)) {
    if (config.categories.includes(category)) return type;
  }
  return "topwear";
}

export function productToForm(product = {}) {
  const productType = product.productType || detectProductType(product.category);
  return {
    ...createEmptyProduct(),
    ...product,
    productType,
    title: product.title || product.name || "",
    price: product.price ?? "",
    discountPercent: product.discountPercent ?? 0,
    attributes: { ...emptyAttributes, ...(product.attributes || {}) },
    variants: product.variants?.length 
      ? product.variants.map(variant => ({
          ...variant,
          color: variant.color || "",
          images: variant.images || [],
          sizes: variant.sizes?.length 
            ? variant.sizes.map(item => ({
                size: item.size,
                stock: Number(item.stock || 0),
                sku: item.sku || "",
              }))
            : [{ size: PRODUCT_TYPE_CONFIG[productType].sizes[0], stock: 0, sku: "" }]
        }))
      : [createBlankVariant(productType)],
    tags: Array.isArray(product.tags) ? product.tags : [],
    careInstructions: Array.isArray(product.careInstructions) ? product.careInstructions : [],
  };
}

export function buildProductForm(data, variantFiles = {}) {
  const form = new FormData();

  const normalFields = ["title", "description", "shortDescription", "brand", "category", "gender", "price", "discountPercent", "collection", "returnPolicy", "isFeatured", "isNewArrival", "isTrending"];

  normalFields.forEach(key => form.append(key, data[key] ?? ""));

  const allowedAttributes = CATEGORY_ATTRIBUTES[data.category] || [];
  const cleanAttributes = {};

  allowedAttributes.forEach(key => {
    const value = data.attributes?.[key];
    if (value !== "" && value !== undefined && value !== null) {
      cleanAttributes[key] = value;
    }
  });

  form.append("attributes", JSON.stringify(cleanAttributes));
  form.append("variants", JSON.stringify(data.variants || []));
  form.append("tags", JSON.stringify(data.tags || []));
  form.append("careInstructions", JSON.stringify(data.careInstructions || []));

  Object.entries(variantFiles).forEach(([variantIndex, files]) => {
    Array.from(files || []).forEach(file => {
      form.append(`variantImages_${variantIndex}`, file);
    });
  });

  return form;
}


// ======================================================
// ATTRIBUTE FIELD COMPONENT
// ======================================================

function AttributeField({ attribute, value, onChange }) {

  if (attribute === "stretchable") {
    return (
      <div className="ng-field">
        <label>Stretchable</label>
        <select className="ng-select" value={value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      </div>
    );
  }

  if (attribute === "heelHeight") {
    return (
      <div className="ng-field">
        <label>Heel Height</label>
        <input className="ng-input" value={value || ""} placeholder="Example: 2 inch" onChange={(e) => onChange(e.target.value)} />
      </div>
    );
  }

  const options = FIELD_OPTIONS[attribute];

  if (options) {
    return (
      <div className="ng-field">
        <label>{ATTRIBUTE_LABELS[attribute] || attribute}</label>
        <select className="ng-select" value={value || ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select {ATTRIBUTE_LABELS[attribute]}</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="ng-field">
      <label>{ATTRIBUTE_LABELS[attribute] || attribute}</label>
      <input className="ng-input" value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}


// ======================================================
// MAIN COMPONENT
// ======================================================

export default function AdminProductForm({
  productForm,
  setProductForm,
  variantFiles,
  setVariantFiles,
  editingId,
  loading,
  onSubmit,
  onClose,
}) {

  const currentConfig = useMemo(() => 
    PRODUCT_TYPE_CONFIG[productForm.productType] || PRODUCT_TYPE_CONFIG.topwear,
    [productForm.productType]
  );

  const activeAttributes = useMemo(() => 
    CATEGORY_ATTRIBUTES[productForm.category] || [],
    [productForm.category]
  );

  const setField = (key, value) => {
    setProductForm(prev => ({ ...prev, [key]: value }));
  };

  const changeProductType = (productType) => {
    const config = PRODUCT_TYPE_CONFIG[productType];
    setProductForm(prev => ({
      ...prev,
      productType,
      category: config.categories[0],
      attributes: { ...emptyAttributes },
      variants: [createBlankVariant(productType)],
    }));
    setVariantFiles({});
  };

  const changeCategory = (category) => {
    setProductForm(prev => ({
      ...prev,
      category,
      attributes: { ...emptyAttributes },
    }));
  };

  const updateVariant = (variantIndex, patch) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === variantIndex ? { ...v, ...patch } : v)
    }));
  };

  const updateVariantSize = (variantIndex, sizeIndex, patch) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) => 
        vIndex === variantIndex 
          ? { ...variant, sizes: variant.sizes.map((s, sIndex) => sIndex === sizeIndex ? { ...s, ...patch } : s) }
          : variant
      )
    }));
  };

  const addVariant = () => {
    setProductForm(prev => ({
      ...prev,
      variants: [...prev.variants, createBlankVariant(prev.productType)]
    }));
  };

  const removeVariant = (variantIndex) => {
    if (productForm.variants.length === 1) return;
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== variantIndex)
    }));
    setVariantFiles(prev => {
      const next = {};
      Object.entries(prev).forEach(([key, files]) => {
        const index = Number(key);
        if (index < variantIndex) next[index] = files;
        if (index > variantIndex) next[index - 1] = files;
      });
      return next;
    });
  };

  const addSize = (variantIndex) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) => {
        if (vIndex !== variantIndex) return variant;
        const used = new Set(variant.sizes.map(s => s.size));
        const nextSize = currentConfig.sizes.find(s => !used.has(s));
        if (!nextSize) return variant;
        return {
          ...variant,
          sizes: [...variant.sizes, { size: nextSize, stock: 0, sku: "" }]
        };
      })
    }));
  };

  const removeSize = (variantIndex, sizeIndex) => {
    setProductForm(prev => ({
      ...prev,
      variants: prev.variants.map((variant, vIndex) => {
        if (vIndex !== variantIndex) return variant;
        if (variant.sizes.length === 1) return variant;
        return {
          ...variant,
          sizes: variant.sizes.filter((_, sIndex) => sIndex !== sizeIndex)
        };
      })
    }));
  };

  return (
    <form className="ng-panel" onSubmit={onSubmit}>

      {/* HEADER */}
      <div className="ng-panel-head">
        <span className="ng-eyebrow">
          {editingId ? "Edit Product" : "Create Product"}
        </span>
        <button className="ng-btn" type="button" onClick={onClose}>
          <X size={14} /> Close
        </button>
      </div>

      {/* CLASSIFICATION */}
      <div className="ng-grid-form-3">
        <div className="ng-field">
          <label>Product Type</label>
          <select className="ng-select" value={productForm.productType} onChange={(e) => changeProductType(e.target.value)}>
            {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>

        <div className="ng-field">
          <label>Category</label>
          <select className="ng-select" value={productForm.category} onChange={(e) => changeCategory(e.target.value)}>
            {currentConfig.categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="ng-field">
          <label>Gender</label>
          <select className="ng-select" value={productForm.gender} onChange={(e) => setField("gender", e.target.value)}>
            {FIELD_OPTIONS.gender.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* BASIC DETAILS */}
      
      
            <div className="ng-grid-form-3">
      
      
              <div className="ng-field">
      
                <label>
                  Product Title
                </label>
      
                <input
      
                  className="ng-input"
      
                  value={
                    productForm.title
                  }
      
                  required
      
                  onChange={(event) =>
                    setField(
                      "title",
                      event.target.value
                    )
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Brand
                </label>
      
                <input
      
                  className="ng-input"
      
                  value={
                    productForm.brand
                  }
      
                  onChange={(event) =>
                    setField(
                      "brand",
                      event.target.value
                    )
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Price
                </label>
      
                <input
      
                  className="ng-input"
      
                  type="number"
      
                  min="0"
      
                  value={
                    productForm.price
                  }
      
                  required
      
                  onChange={(event) =>
                    setField(
                      "price",
                      event.target.value
                    )
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Discount %
                </label>
      
                <input
      
                  className="ng-input"
      
                  type="number"
      
                  min="0"
      
                  max="100"
      
                  value={
                    productForm.discountPercent
                  }
      
                  onChange={(event) =>
                    setField(
                      "discountPercent",
      
                      Number(
                        event.target.value
                      )
                    )
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Collection
                </label>
      
      
                <select
      
                  className="ng-select"
      
                  value={
                    productForm.collection
                  }
      
                  onChange={(event) =>
                    setField(
                      "collection",
                      event.target.value
                    )
                  }
      
                >
      
                  {
                    FIELD_OPTIONS.collection.map(
                      (collection) => (
      
                        <option
                          key={collection}
                          value={collection}
                        >
      
                          {collection}
      
                        </option>
      
                      )
                    )
                  }
      
                </select>
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Return Policy
                </label>
      
      
                <select
      
                  className="ng-select"
      
                  value={
                    productForm.returnPolicy
                  }
      
                  onChange={(event) =>
                    setField(
                      "returnPolicy",
                      event.target.value
                    )
                  }
      
                >
      
                  <option>
                    7 Days Easy Return
                  </option>
      
                  <option>
                    10 Days Easy Return
                  </option>
      
                  <option>
                    15 Days Easy Return
                  </option>
      
                  <option>
                    Exchange Only
                  </option>
      
                  <option>
                    No Return
                  </option>
      
                </select>
      
              </div>
      
      
            </div>
      
      
            {/* DESCRIPTIONS */}
      
      
            <div className="ng-grid-form-2">
      
      
              <div className="ng-field">
      
                <label>
                  Description
                </label>
      
      
                <textarea
      
                  className="ng-textarea"
      
                  rows={5}
      
                  value={
                    productForm.description
                  }
      
                  required
      
                  onChange={(event) =>
                    setField(
                      "description",
                      event.target.value
                    )
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Short Description
                </label>
      
      
                <textarea
      
                  className="ng-textarea"
      
                  rows={5}
      
                  value={
                    productForm.shortDescription
                  }
      
                  onChange={(event) =>
                    setField(
                      "shortDescription",
                      event.target.value
                    )
                  }
      
                />
      
              </div>
      
      
            </div>
      
      
            {/* CATEGORY ATTRIBUTES */}
      
      
            <div
      
              className="ng-panel"
      
              style={{
                background:
                  "var(--ng-cream-soft)",
      
                boxShadow: "none",
              }}
      
            >
      
      
              <div className="ng-panel-head">
      
                <div>
      
                  <span className="ng-eyebrow">
      
                    {
                      productForm.category
                    } Details
      
                  </span>
      
      
                  <p
                    style={{
                      margin:
                        "6px 0 0",
      
                      fontSize: 12,
      
                      color:
                        "var(--ng-muted)",
                    }}
                  >
      
                    Only category-related fields are shown and submitted.
      
                  </p>
      
                </div>
      
              </div>
      
      
              <div className="ng-grid-form-3">
      
                {
                  activeAttributes.map(
                    (attribute) => (
      
                      <AttributeField
      
                        key={
                          attribute
                        }
      
                        attribute={
                          attribute
                        }
      
                        value={
                          productForm
                            .attributes?.[
                              attribute
                            ]
                        }
      
                        onChange={(value) =>
      
                          setProductForm(
                            (previous) => ({
      
                              ...previous,
      
                              attributes: {
      
                                ...previous.attributes,
      
                                [attribute]:
                                  value,
      
                              },
      
                            })
                          )
      
                        }
      
                      />
      
                    )
                  )
                }
      
              </div>
      
      
            </div>
      
      
            {/* VARIANTS */}
      
      
            <div
      
              className="ng-panel"
      
              style={{
                background:
                  "var(--ng-cream-soft)",
      
                boxShadow: "none",
              }}
      
            >
      
      
              <div className="ng-panel-head">
      
                <span className="ng-eyebrow">
      
                  Color & Size Variants
      
                </span>
      
      
                <button
      
                  className="ng-btn"
      
                  type="button"
      
                  onClick={
                    addVariant
                  }
      
                >
      
                  <Plus size={14} />
      
                  Add Variant
      
                </button>
      
              </div>
      
      
              {
                productForm.variants.map(
                  (
                    variant,
                    variantIndex
                  ) => (
      
                    <div
      
                      className="ng-variant-card"
      
                      key={
                        variantIndex
                      }
      
                    >
      
      
                      <div className="ng-grid-form-2">
      
      
                        <div className="ng-field">
      
                          <label>
                            Color / Variant Name
                          </label>
      
      
                          <input
      
                            className="ng-input"
      
                            value={
                              variant.color
                            }
      
                            required
      
                            placeholder={
                              productForm.productType ===
                              "footwear"
      
                                ? "Black / White"
      
                                : "Black"
                            }
      
                            onChange={(event) =>
      
                              updateVariant(
      
                                variantIndex,
      
                                {
                                  color:
                                    event.target.value,
                                }
      
                              )
      
                            }
      
                          />
      
                        </div>
      
      
                        <div className="ng-field">
      
                          <label>
      
                            {
                              variant.color ||
                              `Variant ${
                                variantIndex + 1
                              }`
                            } Images
      
                          </label>
      
      
                          <input
      
                            className="ng-input"
      
                            type="file"
      
                            multiple
      
                            accept="image/png,image/jpeg,image/jpg,image/webp"
      
                            onChange={(event) =>
      
                              setVariantFiles(
                                (previous) => ({
      
                                  ...previous,
      
                                  [variantIndex]:
                                    Array.from(
                                      event.target.files ||
                                      []
                                    ),
      
                                })
                              )
      
                            }
      
                          />
      
      
                          {
                            variant.images?.length >
                              0 && (
      
                              <div
                                style={{
                                  display: "flex",
      
                                  gap: 8,
      
                                  flexWrap:
                                    "wrap",
      
                                  marginTop: 10,
                                }}
                              >
      
                                {
                                  variant.images.map(
                                    (
                                      image,
                                      imageIndex
                                    ) => {
      
                                      const src =
                                        typeof image ===
                                        "string"
      
                                          ? image
      
                                          : image?.url;
      
      
                                      if (!src) {
      
                                        return null;
      
                                      }
      
      
                                      return (
      
                                        <img
      
                                          key={
                                            imageIndex
                                          }
      
                                          src={
                                            src
                                          }
      
                                          alt={
                                            variant.color ||
                                            "Variant"
                                          }
      
                                          style={{
                                            width: 64,
      
                                            height: 78,
      
                                            objectFit:
                                              "cover",
      
                                            borderRadius:
                                              8,
                                          }}
      
                                        />
      
                                      );
      
                                    }
                                  )
                                }
      
                              </div>
      
                            )
                          }
      
                        </div>
      
      
                      </div>
      
      
                      <div
                        style={{
                          display: "flex",
      
                          justifyContent:
                            "space-between",
      
                          alignItems:
                            "center",
      
                          gap: 10,
      
                          flexWrap:
                            "wrap",
      
                          marginBottom:
                            12,
                        }}
                      >
      
      
                        <strong>
                          Sizes & Stock
                        </strong>
      
      
                        <div className="ng-actions">
      
      
                          <button
      
                            className="ng-btn"
      
                            type="button"
      
                            onClick={() =>
                              addSize(
                                variantIndex
                              )
                            }
      
                          >
      
                            <Plus size={14} />
      
                            Add Size
      
                          </button>
      
      
                          {
                            productForm.variants
                              .length > 1 && (
      
                              <button
      
                                className="ng-btn ng-btn-danger"
      
                                type="button"
      
                                onClick={() =>
                                  removeVariant(
                                    variantIndex
                                  )
                                }
      
                              >
      
                                <Trash2
                                  size={14}
                                />
      
                                Remove Variant
      
                              </button>
      
                            )
                          }
      
      
                        </div>
      
      
                      </div>
      
      
                      <div className="ng-grid-form-3">
      
      
                        {
                          variant.sizes.map(
                            (
                              sizeItem,
                              sizeIndex
                            ) => (
      
                              <div
      
                                className="ng-variant-card"
      
                                key={
                                  sizeIndex
                                }
      
                                style={{
                                  marginBottom: 0,
                                }}
      
                              >
      
      
                                <div className="ng-field">
      
                                  <label>
                                    Size
                                  </label>
      
      
                                  <select
      
                                    className="ng-select"
      
                                    value={
                                      sizeItem.size
                                    }
      
                                    onChange={(event) =>
      
                                      updateVariantSize(
      
                                        variantIndex,
      
                                        sizeIndex,
      
                                        {
                                          size:
                                            event.target.value,
                                        }
      
                                      )
      
                                    }
      
                                  >
      
                                    {
                                      currentConfig.sizes.map(
                                        (size) => (
      
                                          <option
                                            key={
                                              size
                                            }
                                            value={
                                              size
                                            }
                                          >
      
                                            {size}
      
                                          </option>
      
                                        )
                                      )
                                    }
      
                                  </select>
      
                                </div>
      
      
                                <div className="ng-field">
      
                                  <label>
                                    Stock
                                  </label>
      
      
                                  <input
      
                                    className="ng-input"
      
                                    type="number"
      
                                    min="0"
      
                                    value={
                                      sizeItem.stock
                                    }
      
                                    onChange={(event) =>
      
                                      updateVariantSize(
      
                                        variantIndex,
      
                                        sizeIndex,
      
                                        {
                                          stock:
                                            Number(
                                              event.target.value
                                            ),
                                        }
      
                                      )
      
                                    }
      
                                  />
      
                                </div>
      
      
                                <div className="ng-field">
      
                                  <label>
                                    Variant SKU
                                  </label>
      
      
                                  <input
      
                                    className="ng-input"
      
                                    value={
                                      sizeItem.sku ||
                                      ""
                                    }
      
                                    placeholder="Optional"
      
                                    onChange={(event) =>
      
                                      updateVariantSize(
      
                                        variantIndex,
      
                                        sizeIndex,
      
                                        {
                                          sku:
                                            event.target.value,
                                        }
      
                                      )
      
                                    }
      
                                  />
      
                                </div>
      
      
                                {
                                  variant.sizes.length >
                                    1 && (
      
                                    <button
      
                                      className="ng-btn ng-btn-danger"
      
                                      type="button"
      
                                      onClick={() =>
                                        removeSize(
      
                                          variantIndex,
      
                                          sizeIndex
      
                                        )
                                      }
      
                                    >
      
                                      <Trash2
                                        size={13}
                                      />
      
                                      Remove Size
      
                                    </button>
      
                                  )
                                }
      
      
                              </div>
      
                            )
                          )
                        }
      
      
                      </div>
      
      
                    </div>
      
                  )
                )
              }
      
      
            </div>
      
      
            {/* TAGS + CARE */}
      
      
            <div className="ng-grid-form-2">
      
      
              <div className="ng-field">
      
                <label>
                  Tags
                </label>
      
      
                <input
      
                  className="ng-input"
      
                  placeholder="premium, casual, cotton"
      
                  value={
                    (
                      productForm.tags ||
                      []
                    ).join(", ")
                  }
      
                  onChange={(event) =>
      
                    setField(
      
                      "tags",
      
                      event.target.value
                        .split(",")
                        .map(
                          (value) =>
                            value.trim()
                        )
                        .filter(Boolean)
      
                    )
      
                  }
      
                />
      
              </div>
      
      
              <div className="ng-field">
      
                <label>
                  Care Instructions
                </label>
      
      
                <textarea
      
                  className="ng-textarea"
      
                  rows={4}
      
                  placeholder="Machine wash cold, Do not bleach"
      
                  value={
                    (
                      productForm
                        .careInstructions ||
                      []
                    ).join(", ")
                  }
      
                  onChange={(event) =>
      
                    setField(
      
                      "careInstructions",
      
                      event.target.value
                        .split(",")
                        .map(
                          (value) =>
                            value.trim()
                        )
                        .filter(Boolean)
      
                    )
      
                  }
      
                />
      
              </div>
      
      
            </div>
      
      
            {/* FLAGS */}
      
      
            <div
              style={{
                display: "flex",
      
                gap: 10,
      
                flexWrap:
                  "wrap",
      
                marginBottom: 20,
              }}
            >
      
              {
                [
                  "isFeatured",
                  "isNewArrival",
                  "isTrending",
                ].map(
                  (key) => (
      
                    <label
      
                      key={key}
      
                      className="ng-check"
      
                    >
      
                      <input
      
                        type="checkbox"
      
                        checked={
                          Boolean(
                            productForm[
                              key
                            ]
                          )
                        }
      
                        onChange={(event) =>
                          setField(
                            key,
                            event.target.checked
                          )
                        }
      
                      />
      
                      {key.replace("is", "")}
      
                    </label>
      
                  )
                )
              }
      
            </div>
      
      
            {/* SUBMIT */}
      

      <button className="ng-btn ng-btn-primary" disabled={loading}>
        <Plus size={16} />
        {loading ? "Saving..." : editingId ? "Update Product" : "Create Product"}
      </button>

    </form>
  );
}