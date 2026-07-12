export const normalizeProduct = (product = {}) => {

    const productImages = Array.isArray(product.images)
        ? product.images
        : [];

    const variantImages = product.variants
        ?.flatMap((variant) => variant.images || [])
        || [];

    const firstImage =
        productImages[0]?.url ||
        productImages[0] ||
        variantImages[0]?.url ||
        variantImages[0] ||
        product.image ||
        "";

    return {

        ...product,

        id:
            product._id ||
            product.id,

        name:
            product.name ||
            product.title ||
            "Untitled Product",

        price:
            product.finalPrice ??
            product.price ??
            0,

        originalPrice:
            product.price ??
            product.finalPrice ??
            0,

        image:
            firstImage,

        images:
            productImages.length > 0
                ? productImages
                : variantImages

    };

};



export const firstAvailableVariant = (product = {}) => {

    const variants = product.variants || [];

    for (const variant of variants) {

        const availableSize = variant.sizes?.find(
            (item) => Number(item.stock) > 0
        );

        if (availableSize) {

            return {

                color:
                    variant.color || "",

                size:
                    availableSize.size || ""

            };

        }

    }

    const firstVariant = variants[0];

    const firstSize = firstVariant?.sizes?.[0];

    return {

        color:
            firstVariant?.color || "",

        size:
            firstSize?.size || ""

    };

};



export const backendSort = (sort) => {

    if (sort === "price-low") {

        return "lowToHigh";

    }

    if (sort === "price-high") {

        return "highToLow";

    }

    if (sort === "popularity") {

        return "popular";

    }

    return sort || "newest";

};



export const backendGender = (gender) => {

    if (!gender) {

        return "";

    }

    const lower =
        String(gender).toLowerCase();

    if (lower === "men") {

        return "Men";

    }

    if (lower === "women") {

        return "Women";

    }

    if (lower === "kids") {

        return "Kids";

    }

    if (lower === "unisex") {

        return "Unisex";

    }

    return gender;

};