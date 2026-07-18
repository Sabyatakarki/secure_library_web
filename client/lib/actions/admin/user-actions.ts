"use server";

import {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../../api/admin/user";

import { revalidatePath } from "next/cache";



// Create User
export const handleCreateUser = async (
    data: FormData
) => {

    try {

        const response =
            await createUser(data);


        if (response.success) {

            revalidatePath("/admin/users");


            return {
                success: true,
                message: "User created successfully",
                data: response.data
            };

        }


        return {
            success: false,
            message:
                response.message ||
                "User creation failed"
        };


    } catch(error: Error | any) {

        return {
            success:false,
            message:
                error.message ||
                "Create user action failed"
        };

    }

};





// Get All Users
export const handleGetUsers = async (
    page?: string,
    size?: string,
    search?: string
) => {

    try {

        const response =
            await getAllUsers(
                page,
                size,
                search
            );


        if(response.success){

            return {
                success:true,
                data:response.data,
                pagination:
                    response.pagination
            };

        }


        return {
            success:false,
            message:
                response.message ||
                "Failed to fetch users"
        };


    } catch(error: Error | any){

        return {
            success:false,
            message:
                error.message ||
                "Get users action failed"
        };

    }

};






// Get User By Id
export const handleGetUserById = async (
    id:string
) => {

    try {

        const response =
            await getUserById(id);



        if(response.success){

            return {
                success:true,
                data:response.data
            };

        }



        return {
            success:false,
            message:
                response.message ||
                "Failed to fetch user"
        };


    } catch(error:Error | any){

        return {
            success:false,
            message:
                error.message ||
                "Get user action failed"
        };

    }

};







// Update User
export const handleUpdateUser = async (
    id:string,
    data:FormData
) => {

    try {

        const response =
            await updateUser(
                id,
                data
            );



        if(response.success){

            revalidatePath("/admin/users");


            return {
                success:true,
                message:
                    "User updated successfully",
                data:response.data
            };

        }



        return {
            success:false,
            message:
                response.message ||
                "User update failed"
        };


    } catch(error:Error | any){

        return {
            success:false,
            message:
                error.message ||
                "Update user action failed"
        };

    }

};







// Delete User
export const handleDeleteUser = async (
    id:string
) => {

    try {

        const response =
            await deleteUser(id);



        if(response.success){

            revalidatePath("/admin/users");


            return {
                success:true,
                message:
                    "User deleted successfully"
            };

        }



        return {
            success:false,
            message:
                response.message ||
                "User deletion failed"
        };


    } catch(error:Error | any){

        return {
            success:false,
            message:
                error.message ||
                "Delete user action failed"
        };

    }

};