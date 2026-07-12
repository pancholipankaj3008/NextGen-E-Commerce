export const SelectCouponState = (state) =>
    state.coupon;



export const SelectCoupons = (state) =>
    state.coupon.coupons;



export const SelectAppliedCoupon = (state) =>
    state.coupon.appliedCoupon;



export const SelectDiscountAmount = (state) =>
    state.coupon.discountAmount;



export const SelectFinalTotal = (state) =>
    state.coupon.finalTotal;



export const SelectCouponLoading = (state) =>
    state.coupon.loading;



export const SelectCouponApplyLoading = (state) =>
    state.coupon.applyLoading;



export const SelectCouponMessage = (state) =>
    state.coupon.message;



export const SelectCouponError = (state) =>
    state.coupon.error;