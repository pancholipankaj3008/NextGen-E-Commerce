export const SelectProductState = (state) =>
    state.product;



export const SelectProducts = (state) =>
    state.product.products;



export const SelectSingleProduct = (state) =>
    state.product.product;



export const SelectFeaturedProducts = (state) =>
    state.product.featuredProducts;



export const SelectTrendingProducts = (state) =>
    state.product.trendingProducts;



export const SelectNewArrivals = (state) =>
    state.product.newArrivals;



export const SelectRelatedProducts = (state) =>
    state.product.relatedProducts;



export const SelectProductLoading = (state) =>
    state.product.loading;



export const SelectSingleProductLoading = (state) =>
    state.product.productLoading;



export const SelectProductPagination = (state) => ({

    totalProducts: state.product.totalProducts,

    totalPages: state.product.totalPages,

    currentPage: state.product.currentPage

});