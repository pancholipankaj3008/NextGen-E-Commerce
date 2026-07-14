import API from "../../api/axios";
export const CreateReturnAPI = ({ orderId, reason }) => API.post(`/returns/${orderId}`, { reason });
export const GetMyReturnsAPI = () => API.get("/returns/my-returns");
export const GetReturnsAPI = () => API.get("/returns");
export const UpdateReturnAPI = ({ id, status }) => API.put(`/returns/${id}`, { status });
