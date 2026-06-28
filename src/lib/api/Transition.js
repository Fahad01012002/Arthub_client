import { protectedFetch } from "../core/Server"

export const getArtworksFromTransaction = async (userId) => {
    return protectedFetch(`/api/artwork-transaction/${userId}`);
}