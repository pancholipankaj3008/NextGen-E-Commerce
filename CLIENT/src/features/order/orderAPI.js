import API from "../../api/axios";


export const CreateOrderAPI = (orderData) => {

    return API.post(
        "/order/place-order",
        orderData
    );

};


export const GetMyOrdersAPI = () => {

    return API.get(
        "/order/my-orders"
    );

};


export const GetSingleOrderAPI = (id) => {

    return API.get(
        `/order/order/${id}`
    );

};


export const CancelOrderAPI = (id) => {

    return API.put(
        `/order/cancel-order/${id}`
    );

};


export const GetAllOrdersAPI = (params) => {

    return API.get(
        "/order/all-orders",
        {
            params
        }
    );

};


export const UpdateOrderStatusAPI = (id, statusData) => {

    return API.put(
        `/order/update-status/${id}`,
        statusData
    );

};