export const selectAdmin =
  (state) => state.admin;


export const selectAdminLoading =
  (state) => state.admin.loading;


export const selectAdminError =
  (state) => state.admin.error;


export const selectAdminDashboard =
  (state) => state.admin.dashboard;


export const selectUserAnalytics =
  (state) => state.admin.userAnalytics;


export const selectProductAnalytics =
  (state) => state.admin.productAnalytics;


export const selectAdminUsers =
  (state) => state.admin.users;


export const selectAdminCoupons =
  (state) => state.admin.coupons;


export const selectAdminOrders =
  (state) => state.admin.orders;


export const selectCustomerUsers = (state) => {

  const staffRoles = [
    "admin",
    "product manager",
    "order manager",
    "inventory staff",
  ];

  return state.admin.users.filter(
    (user) =>
      !staffRoles.includes(user.role)
  );

};


export const selectStaffUsers = (state) => {

  const staffRoles = [
    "admin",
    "product manager",
    "order manager",
    "inventory staff",
  ];

  return state.admin.users.filter(
    (user) =>
      staffRoles.includes(user.role)
  );

};