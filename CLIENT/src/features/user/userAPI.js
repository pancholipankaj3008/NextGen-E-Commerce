import API from "../../api/axios";



export const GetAllUsersAPI = () => {

    return API.get("/user/all-users");

};



export const CreateUserByAdminAPI = (userData) => {

    return API.post("/user/create-user", userData);

};



export const UpdateUserByAdminAPI = (id, userData) => {

    return API.put(`/user/update-user/${id}`, userData);

};



export const DeleteUserAPI = (id) => {

    return API.delete(`/user/delete-user/${id}`);

};



export const BlockUserAPI = (id) => {

    return API.put(`/user/block-user/${id}`);

};



export const UnblockUserAPI = (id) => {

    return API.put(`/user/unblock-user/${id}`);

};



export const UserAnalyticsAPI = () => {

    return API.get("/user/user-analytics");

};