import { protectedFetch, serverFetch } from "../core/Server"


export const getArtworksAll = async () => {
    return serverFetch(`/api/artworks`);
} 

export const getArtworksById = async (artistId) => {
    return protectedFetch(`/api/getArtworksById/${artistId}`)
}

export const getArtworkDetails = async (artworkId) => {
    return serverFetch(`/api/artwork-details/${artworkId}`);
}

export const getPlan = async (planId) => {
    return protectedFetch(`/api/plans/${planId}`);
}