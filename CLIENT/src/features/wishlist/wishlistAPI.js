import API from "../../api/axios";



export const GetWishlistAPI = () => {

    return API.get("/user/wishlist");

};



export const AddToWishlistAPI = (productId) => {

    return API.post(
        `/user/add-wishlist/${productId}`
    );

};



export const RemoveWishlistAPI = (productId) => {

    return API.delete(
        `/user/remove-wishlist/${productId}`
    );

};