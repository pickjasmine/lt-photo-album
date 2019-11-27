const readline = require('readline');
const Chance = require('chance');

const {getPhotosByAlbumId} = require('../fetch-service');

jest.mock('readline');
jest.mock('../fetch-service');

describe('photo album console app', () => {
    const chance = new Chance();

    let mockReadline,
        questionCallback,
        expectedPhotos,
        expectedAlbumId,
        expectedPhotoId,
        expectedPhotoTitle;

    beforeAll(() => {
        global.process = jest.mock();

        expectedPhotos = [{
            id: expectedPhotoId,
            title: expectedPhotoTitle
        }];
        getPhotosByAlbumId.mockResolvedValue(expectedPhotos);

        mockReadline = {
            question: jest.fn().mockImplementation((mockAlbumId) => jest.fn().mockResolvedValue(mockAlbumId)),
            write: jest.fn(),
            close: jest.fn()
        };
        readline.createInterface = jest.fn().mockReturnValue(mockReadline);

        expectedAlbumId = chance.string();

        require('../index');

        questionCallback = mockReadline.question.mock.calls[0][1];
    });

    afterAll(() => {
        jest.resetAllMocks();
    });

    test('should initialize readline', () => {
        expect(readline.createInterface).toHaveBeenCalledTimes(1);
        expect(readline.createInterface).toHaveBeenCalledWith({
            input: process.stdin,
            output: process.stdout
        });
    });

    test('should ask a question to the user', () => {
        expect(mockReadline.question.mock.calls[0][0]).toEqual('Which photo album would you like to view? ');
        expect(questionCallback).toEqual(expect.any(Function));
    });

    describe('upon successful question callback', () => {
        beforeAll(async () => {
            await questionCallback(expectedAlbumId);
        });

        test('should call to get the photos by the given album id', () => {
            expect(getPhotosByAlbumId).toHaveBeenCalledTimes(1);
            expect(getPhotosByAlbumId).toHaveBeenCalledWith(expectedAlbumId)
        });

        test('should write a message to display the photo Ids and title', () => {
            expect(mockReadline.write).toHaveBeenCalledTimes(3);
            expect(mockReadline.write).toHaveBeenCalledWith(`\nDisplaying photos from album ${expectedAlbumId}`);
            expect(mockReadline.write).toHaveBeenCalledWith(`\n[${expectedPhotoId}] ${expectedPhotoTitle}\n`);
            expect(mockReadline.write).toHaveBeenCalledWith(`\nGoodbye!`);
        });

    });

    describe('when no photos are found', () => {
        test('should write a message to let the user know no photos were found', async () => {
            mockReadline.write.mockClear();

            getPhotosByAlbumId.mockResolvedValue([]);
            await questionCallback(expectedAlbumId);

            expect(mockReadline.write).toHaveBeenCalledTimes(1);
            expect(mockReadline.write).toHaveBeenCalledWith(`\nThere were no photos found for the album: ${expectedAlbumId}`);
        });
    });


});
