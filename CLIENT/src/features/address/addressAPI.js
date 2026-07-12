import API from "../../api/axios";



export const AddAddressAPI = (addressData) => {

    return API.post("/user/add-address", addressData);

};



export const UpdateAddressAPI = (addressId, addressData) => {

    return API.put(
        `/user/update-address/${addressId}`,
        addressData
    );

};



export const RemoveAddressAPI = (addressId) => {

    return API.delete(
        `/user/remove-address/${addressId}`
    );

};