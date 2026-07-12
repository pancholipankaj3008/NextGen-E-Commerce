import API from "../../api/axios";

const unavailable = (message) =>
    Promise.reject({
        response: {
            data: {
                success: false,
                message
            }
        }
    });



export const GetUserAnalyticsAPI = () => {

    return API.get(
        "/user/user-analytics"
    );

};



export const GetProductAnalyticsAPI = () => {

    return API.get(
        "/product/product-analytics"
    );

};



export const GetOrderAnalyticsAPI = () => {

    return unavailable("Order analytics route is not available in backend");

};



export const GetRevenueAnalyticsAPI = () => {

    return unavailable("Revenue analytics route is not available in backend");

};



export const GetRecentOrdersAPI = () => {

    return API.get(
        "/order/all-orders"
    );

};



export const GetTopSellingProductsAPI = () => {

    return unavailable("Top selling products route is not available in backend");

};
