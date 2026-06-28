import { serverMutation } from "../core/Server"


export const updateStatus = async (artworkId, data = { status: 'Sold' }) => {
    return serverMutation(`/api/update-status/${artworkId}`, data, 'PATCH');
}