import axios from "axios";

const API = axios.create({

    baseURL: "http://localhost:5000/api",

    withCredentials: true

});

API.interceptors.response.use(
    (response) => {
        if (response.data?.success === false) {
            return Promise.reject({ response });
        }

        return response;
    },
    (error) => Promise.reject(error)
);

export default API;
