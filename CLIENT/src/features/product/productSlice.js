import { createSlice } from "@reduxjs/toolkit";

import {

    GetAllProducts,

    GetSingleProduct,

    GetFeaturedProducts,

    GetTrendingProducts,

    GetNewArrivals,

    GetRelatedProducts,

    AddProduct,

    UpdateProduct,

    DeleteProduct

} from "./productThunk";



const initialState = {

    products: [],

    product: null,

    featuredProducts: [],

    trendingProducts: [],

    newArrivals: [],

    relatedProducts: [],

    totalProducts: 0,

    totalPages: 0,

    currentPage: 1,

    loading: false,

    productLoading: false,

    message: "",

    error: null

};



const productSlice = createSlice({

    name: "product",

    initialState,

    reducers: {

        ClearProductMessage: (state) => {

            state.message = "";

            state.error = null;

        },

        ClearSingleProduct: (state) => {

            state.product = null;

            state.relatedProducts = [];

        }

    },

    extraReducers: (builder) => {

        builder



            // Get All Products

            .addCase(GetAllProducts.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(GetAllProducts.fulfilled, (state, action) => {

                state.loading = false;

                state.products = action.payload.products;

                state.totalProducts =
                    action.payload.totalProducts || 0;

                state.totalPages =
                    action.payload.totalPages || 0;

                state.currentPage =
                    action.payload.currentPage || 1;

            })

            .addCase(GetAllProducts.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Get Single Product

            .addCase(GetSingleProduct.pending, (state) => {

                state.productLoading = true;

                state.error = null;

            })

            .addCase(GetSingleProduct.fulfilled, (state, action) => {

                state.productLoading = false;

                state.product = action.payload.product;

            })

            .addCase(GetSingleProduct.rejected, (state, action) => {

                state.productLoading = false;

                state.error = action.payload?.message;

            })



            // Featured Products

            .addCase(GetFeaturedProducts.pending, (state) => {

                state.loading = true;

            })

            .addCase(GetFeaturedProducts.fulfilled, (state, action) => {

                state.loading = false;

                state.featuredProducts =
                    action.payload.products;

            })

            .addCase(GetFeaturedProducts.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Trending Products

            .addCase(GetTrendingProducts.pending, (state) => {

                state.loading = true;

            })

            .addCase(GetTrendingProducts.fulfilled, (state, action) => {

                state.loading = false;

                state.trendingProducts =
                    action.payload.products;

            })

            .addCase(GetTrendingProducts.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // New Arrivals

            .addCase(GetNewArrivals.pending, (state) => {

                state.loading = true;

            })

            .addCase(GetNewArrivals.fulfilled, (state, action) => {

                state.loading = false;

                state.newArrivals =
                    action.payload.products;

            })

            .addCase(GetNewArrivals.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Related Products

            .addCase(GetRelatedProducts.pending, (state) => {

                state.productLoading = true;

            })

            .addCase(GetRelatedProducts.fulfilled, (state, action) => {

                state.productLoading = false;

                state.relatedProducts =
                    action.payload.products;

            })

            .addCase(GetRelatedProducts.rejected, (state, action) => {

                state.productLoading = false;

                state.error = action.payload?.message;

            })



            // Add Product

            .addCase(AddProduct.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(AddProduct.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                if (action.payload.product) {

                    state.products.unshift(
                        action.payload.product
                    );

                }

            })

            .addCase(AddProduct.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Update Product

            .addCase(UpdateProduct.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(UpdateProduct.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                if (action.payload.product) {

                    let index = state.products.findIndex(
                        (product) =>
                            product._id ===
                            action.payload.product._id
                    );

                    if (index !== -1) {

                        state.products[index] =
                            action.payload.product;

                    }

                    if (
                        state.product?._id ===
                        action.payload.product._id
                    ) {

                        state.product =
                            action.payload.product;

                    }

                }

            })

            .addCase(UpdateProduct.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            })



            // Delete Product

            .addCase(DeleteProduct.pending, (state) => {

                state.loading = true;

                state.error = null;

            })

            .addCase(DeleteProduct.fulfilled, (state, action) => {

                state.loading = false;

                state.message = action.payload.message;

                state.products = state.products.filter(
                    (product) =>
                        product._id !== action.payload.id
                );

            })

            .addCase(DeleteProduct.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload?.message;

            });

    }

});



export const {

    ClearProductMessage,

    ClearSingleProduct

} = productSlice.actions;



export default productSlice.reducer;