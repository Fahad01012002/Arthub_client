import { serverMutation } from "../core/Server"

export const updateUser = async (planId, buyerId) => {
    return serverMutation(`/api/update-user/${buyerId}`, { planId }, 'PATCH');
}