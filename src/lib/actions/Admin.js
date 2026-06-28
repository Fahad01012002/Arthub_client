import { protectedFetch, serverMutation } from "../core/Server"

export const  updateRole = async (userId , newRole) => {
    return serverMutation(`/api/update-role/${userId}`, { newRole }, 'PATCH');
}

export const getTransactionHistory = async () => {
    return protectedFetch('/api/transaction-history');
}

export const updateUserDetails = async (userId , name , email) => {
    return serverMutation(`/api/update-user-details/${userId}` , {name , email} , 'PATCH');
}