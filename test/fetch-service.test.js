const fetch = require('node-fetch');
const Chance = require('chance');

const {getPhotosByAlbumId} = require('../fetch-service');

jest.mock('node-fetch');

describe('fetch-service', () => {
    const chance = new Chance();

    let mockFetchResponse,
        expectedParsedResponse,
        expectedAlbumId,
        actualResponse;

    beforeEach(async () => {
        expectedAlbumId = chance.string();
        expectedParsedResponse = chance.string();
        mockFetchResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue(expectedParsedResponse)
        };
        fetch.mockResolvedValue(mockFetchResponse);

        actualResponse = await getPhotosByAlbumId(expectedAlbumId);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('should call to get the photos by the given album Id', () => {
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith(`https://jsonplaceholder.typicode.com/photos?albumId=${expectedAlbumId}`);
    });

    test('should return the parsed response', () => {
        expect(mockFetchResponse.json).toHaveBeenCalledTimes(1);
        expect(actualResponse).toEqual(expectedParsedResponse);
    });

    test('should return an empty array if the call was unsuccessful', async () => {
        mockFetchResponse.ok = false;

        actualResponse = await getPhotosByAlbumId(expectedAlbumId);

        expect(actualResponse).toEqual([]);
    });

});
