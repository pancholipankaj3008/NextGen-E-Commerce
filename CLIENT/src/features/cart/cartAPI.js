import API from "../../api/axios";


export const GetCartAPI = () => {

    return API.get(
        "/cart/my-cart"
    );

};


export const AddToCartAPI = (cartData) => {

    return API.post(
        "/cart/add-cart",
        cartData
    );

};


export const UpdateCartQuantityAPI = (cartItemId, quantity) => {

  return API.put(

    `/cart/update-cart/${cartItemId}`,

    {
      quantity
    }

  );

};


export const RemoveCartItemAPI = (cartItemId) => {

  return API.delete(

    `/cart/remove-cart/${cartItemId}`

  );

};


export const ClearCartAPI = () => {

    return API.delete(
        "/cart/clear-cart"
    );

};
