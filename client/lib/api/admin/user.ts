import { API } from "../endpoints";
import axios from "../axios";


// Create User
export const createUser = async (userData: any) => {
    try {

        const response = await axios.post(
            API.ADMIN.USERS.CREATE,
            userData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;

    } catch (error: Error | any) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Create user failed"
        );
    }
};




// Get All Users
export const getAllUsers = async (
    page?: string,
    size?: string,
    search?: string
) => {

    try {

        const response = await axios.get(
            API.ADMIN.USERS.GET_ALL,
            {
                params: {
                    page,
                    size,
                    search,
                },
            }
        );


        return response.data;


    } catch (error: Error | any) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Get users failed"
        );

    }

};





// Get User By Id
export const getUserById = async (
    id: string
) => {

    try {

        const response = await axios.get(
            API.ADMIN.USERS.GET_BY_ID(id)
        );


        return response.data;


    } catch (error: Error | any) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Get user failed"
        );

    }

};


// Update User
export const updateUser = async (
    id: string,
    userData: any
) => {

    try {

        const response = await axios.put(
            API.ADMIN.USERS.UPDATE(id),
            userData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );


        return response.data;


    } catch (error: Error | any) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Update user failed"
        );

    }

};






// Delete User
export const deleteUser = async (
    id: string
) => {

    try {

        const response = await axios.delete(
            API.ADMIN.USERS.DELETE(id)
        );


        return response.data;


    } catch (error: Error | any) {

        throw new Error(
            error.response?.data?.message ||
            error.message ||
            "Delete user failed"
        );

    }

};