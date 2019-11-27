const fetch = require('node-fetch');

const getPhotosByAlbumId = async (albumId) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`);

    if (!response.ok) {
        return [];
    }

    return response.json()
};

module.exports = {
    getPhotosByAlbumId
};
