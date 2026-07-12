import API from "../../api/axios";



export const GetAllProductsAPI = (params) => {

    return API.get("/product/all-products", {
        params
    });

};



export const GetSingleProductAPI = (id) => {

    return API.get(
        `/product/single-product/${id}`
    );

};



export const GetFeaturedProductsAPI = () => {

    return API.get(
        "/product/featured-products"
    );

};



export const GetTrendingProductsAPI = () => {

    return API.get(
        "/product/trending-products"
    );

};



export const GetNewArrivalsAPI = () => {

    return API.get(
        "/product/new-arrivals"
    );

};



export const GetRelatedProductsAPI = (productId) => {

    return API.get(
        `/product/related-products/${productId}`
    );

};



export const AddProductAPI = (productData) => {

    return API.post(
        "/product/add-product",
        productData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};



export const UpdateProductAPI = (id, productData) => {

    return API.put(
        `/product/update-product/${id}`,
        productData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

};



export const DeleteProductAPI = (id) => {

    return API.delete(
        `/product/delete-product/${id}`
    );

};
