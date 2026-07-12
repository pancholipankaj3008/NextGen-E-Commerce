import API from "../../api/axios";



export const SubscribeNewsletterAPI = (email) => {

    return API.post(
        "/newsletter/subscribe",
        {
            email
        }
    );

};



export const UnsubscribeNewsletterAPI = (email) => {

    return API.post(
        "/newsletter/unsubscribe",
        {
            email
        }
    );

};



export const GetAllSubscribersAPI = () => {

    return API.get(
        "/newsletter/all-subscribers"
    );

};



export const DeleteSubscriberAPI = (id) => {

    return API.delete(
        `/newsletter/delete-subscriber/${id}`
    );

};