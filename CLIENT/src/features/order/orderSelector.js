export const SelectOrderState = (state) =>
    state.order;



export const SelectMyOrders = (state) =>
    state.order.myOrders;



export const SelectAllOrders = (state) =>
    state.order.allOrders;



export const SelectSingleOrder = (state) =>
    state.order.order;



export const SelectCreatedOrder = (state) =>
    state.order.createdOrder;



export const SelectOrderLoading = (state) =>
    state.order.loading;



export const SelectOrderActionLoading = (state) =>
    state.order.actionLoading;



export const SelectOrderMessage = (state) =>
    state.order.message;



export const SelectOrderError = (state) =>
    state.order.error;



export const SelectOrderPagination = (state) => ({

    totalOrders: state.order.totalOrders,

    totalPages: state.order.totalPages,

    currentPage: state.order.currentPage

});