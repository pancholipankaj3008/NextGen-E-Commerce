import API from "../../api/axios";



export const CreateReviewAPI = (reviewData) => {

    return API.post(
        `/review/add-review/${reviewData.productId}`,
        {
            rating: reviewData.rating,
            comment: reviewData.comment
        }
    );

};



export const GetProductReviewsAPI = (productId) => {

    return API.get(
        `/review/product-reviews/${productId}`
    );

};



export const UpdateReviewAPI = () => {
    return Promise.reject({
        response: {
            data: {
                success: false,
                message: "Review update route is not available in backend"
            }
        }
    });

};



export const DeleteReviewAPI = (id) => {

    return API.delete(
        `/review/delete-review/${id}`
    );

};
