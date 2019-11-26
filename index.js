const readline = require('readline');
const fetch = require('node-fetch');

const start = () => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Which photo album would you like to view? ', async (answer) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${answer}`);

        const parsedResponse = await response.json();

        const photoIdAndTitles = parsedResponse.map((photo) => `[${photo.id}] ${photo.title} \n`).join('');

        console.log(`Display Photo Album ${answer}`);

        console.log(photoIdAndTitles.toString());

        rl.close();
    });
};

start();
