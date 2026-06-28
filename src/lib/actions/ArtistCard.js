import { serverMutation } from "../core/Server"


export const createArtistCard = async (data) => {
    return serverMutation('/api/artistcard', data);
}

export const updateArtistCard = async (artworkId, updatedData) => {
    return serverMutation(`/api/artistcard/${artworkId}`, updatedData, 'PATCH');
}

export const deleteArtistCard = async (artworkId) => {
    return serverMutation(
        `/api/artwork/${artworkId}`,
        null,
        'DELETE'
    );
};