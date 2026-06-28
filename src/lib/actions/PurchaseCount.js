import { serverMutation } from "../core/Server"

export const updateUserPurchaseCount = async (userId) => {
    return serverMutation(`/api/update-purchase-count/${userId}` , null , 'PATCH');
}