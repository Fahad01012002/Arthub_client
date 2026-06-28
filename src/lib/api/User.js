import { protectedFetch } from "../core/Server"

export const getAllUsers = async () => {
    return protectedFetch('/api/all-users');
}

export const getDetails = async (buyerId) => {
    return protectedFetch(`/api/user-purchased-artworks/${buyerId}`);
}

export const getTransactionHistory = async (buyerId) => {
    return protectedFetch(`/api/user-transaction-history/${buyerId}`);
}