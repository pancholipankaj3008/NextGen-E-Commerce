export const SelectPaymentState = (state) =>
    state.payment;



export const SelectPaymentOrder = (state) =>
    state.payment.paymentOrder;



export const SelectPayment = (state) =>
    state.payment.payment;



export const SelectMyPayments = (state) =>
    state.payment.myPayments;



export const SelectAllPayments = (state) =>
    state.payment.allPayments;



export const SelectPaymentLoading = (state) =>
    state.payment.loading;



export const SelectPaymentActionLoading = (state) =>
    state.payment.paymentLoading;



export const SelectPaymentMessage = (state) =>
    state.payment.message;



export const SelectPaymentError = (state) =>
    state.payment.error;



export const SelectPaymentPagination = (state) => ({

    totalPayments: state.payment.totalPayments,

    totalPages: state.payment.totalPages,

    currentPage: state.payment.currentPage

});