const nodeReadline = require('readline');

const {getPhotosByAlbumId} = require('./fetch-service');

const formatPhotoIdsAndTitlesForPrint = (photos) => photos.map((photo) => `[${photo.id}] ${photo.title}`).join('\n');

const start = () => {
    const readline = nodeReadline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Which photo album would you like to view? ', async (albumId) => {
        const photos = await getPhotosByAlbumId(albumId);

        if (!photos.length) {
            readline.write(`\nThere were no photos found for the album: ${albumId}`);
        } else {
            const photoIdAndTitles = formatPhotoIdsAndTitlesForPrint(photos);

            readline.write(`\nDisplaying photos from album ${albumId}`);

            readline.write(`\n${photoIdAndTitles.toString()}\n`);

            readline.write('\nGoodbye!');
        }

        readline.close();
    });

};

start();
