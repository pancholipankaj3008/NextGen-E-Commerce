import API from "../../api/axios";



export const CreateCouponAPI = (couponData) => {

    return API.post(
        "/coupon/create-coupon",
        couponData
    );

};



export const GetAllCouponsAPI = () => {

    return API.get(
        "/coupon/all-coupons"
    );

};



export const ApplyCouponAPI = (couponData) => {

    return API.post(
        "/coupon/apply-coupon",
        couponData
    );

};



export const UpdateCouponAPI = (id, couponData) => {

    return API.put(
        `/coupon/update-coupon/${id}`,
        couponData
    );

};



export const DeleteCouponAPI = (id) => {

    return API.delete(
        `/coupon/delete-coupon/${id}`
    );

};
