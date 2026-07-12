import API from "../../api/axios";


// ================= DASHBOARD =================

export const GetUserAnalyticsAPI = () => {
  return API.get("/user/user-analytics");
};

export const GetProductAnalyticsAPI = () => {
  return API.get("/product/product-analytics");
};


// ================= USERS =================

export const GetAdminUsersAPI = () => {
  return API.get("/user/all-users");
};

export const CreateAdminUserAPI = (payload) => {
  return API.post("/user/create-user", payload);
};

export const UpdateAdminUserAPI = (id, data) => {
  return API.put(`/user/update-user/${id}`, data);
};

export const DeleteAdminUserAPI = (id) => {
  return API.delete(`/user/delete-user/${id}`);
};

export const BlockAdminUserAPI = (id) => {
  return API.put(`/user/block-user/${id}`);
};

export const UnblockAdminUserAPI = (id) => {
  return API.put(`/user/unblock-user/${id}`);
};


// ================= COUPONS =================

export const GetAdminCouponsAPI = () => {
  return API.get("/coupon/all-coupons");
};

export const CreateAdminCouponAPI = (payload) => {
  return API.post("/coupon/create-coupon", payload);
};

export const UpdateAdminCouponAPI = (id, data) => {
  return API.put(`/coupon/update-coupon/${id}`, data);
};

export const DeleteAdminCouponAPI = (id) => {
  return API.delete(`/coupon/delete-coupon/${id}`);
};


// ================= PRODUCTS =================

export const CreateAdminProductAPI = (formData) => {
  return API.post(
    "/product/add-product",
    formData
  );
};

export const UpdateAdminProductAPI = (id, formData) => {
  return API.put(
    `/product/update-product/${id}`,
    formData
  );
};

export const DeleteAdminProductAPI = (id) => {
  return API.delete(`/product/delete-product/${id}`);
};


// ================= ORDERS =================

export const GetAdminOrdersAPI = () => {
  return API.get("/order/all-orders");
};

export const UpdateAdminOrderStatusAPI = (id, data) => {
  return API.put(
    `/order/update-status/${id}`,
    data
  );
};