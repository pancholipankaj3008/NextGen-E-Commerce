const unavailable = (message) =>
    Promise.reject({
        response: {
            data: {
                success: false,
                message
            }
        }
    });



export const CreatePaymentAPI = () => {

    return unavailable("Payment routes are not available in backend");

};



export const VerifyPaymentAPI = () => {

    return unavailable("Payment routes are not available in backend");

};



export const GetMyPaymentsAPI = () => {

    return unavailable("Payment routes are not available in backend");

};



export const GetSinglePaymentAPI = () => {

    return unavailable("Payment routes are not available in backend");

};



export const GetAllPaymentsAPI = () => {

    return unavailable("Payment routes are not available in backend");

};



export const RefundPaymentAPI = () => {

    return unavailable("Payment routes are not available in backend");

};
