const request = require('supertest');
const {
    USERS_PREFIX,
    resetDB,
    createTestUser,
    loginTestUser
} = require('../../../__tests__');
const app = require('../../../app');
const errorTexts = require('../../../ResponseHandling/ResponseText/errors');
const { SUCCESS, UNAUTHORIZED } = require('../../../ResponseHandling/statuses');
const db = require('../../../Config/db');

const route = `/refetch`;
let token;

describe('GET /refetch', () => {
    beforeAll(async () => {
        await createTestUser(db)
        token = await loginTestUser(db);
    });

    afterAll(async () => await resetDB(db));

    describe('refetching a user', () => {

        it('should ensure an access token in the authorization header is checked for', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`);

            expect(response?.body?.error).toBeDefined();
            expect(response.body.error.message).toBe(errorTexts.notLoggedIn.messageText);
            expect(response.statusCode).toBe(UNAUTHORIZED);
        });

        it('should ensure only valid access tokens are authenticated', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`)
                .set({ authorization: `123` });

            expect(response?.body?.error).toBeDefined();
            expect(response.body.error.message).toBe(errorTexts.JsonWebTokenError.messageText);
            expect(response.statusCode).toBe(UNAUTHORIZED);
        });

        it('should return everything inside { data: { user: {} }, status }', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`)
                .set({ authorization: `Bearer ${token}` });

            expect(response?.body?.data).toBeDefined();
            expect(response.body.statusCode).toBeDefined();
            expect(response.body.data.user).toBeDefined();
            expect(Object.keys(response.body.data.user)).toContain('first_name');
        });

        it('should ensure all the associated lists are returned back to the user along with the user object', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`)
                .set({ authorization: `Bearer ${token}` });

            expect(response?.body?.data?.user).toBeDefined();

            const user = response.body.data.user;
            expect(user.activity_count).toBeDefined();
            expect(user.ticks).toBeDefined();
            expect(user.follower_count).toBeDefined();
            expect(user.following_count).toBeDefined();
            expect(user.images).toBeDefined();
        });

        it('should ensure the password doesn\'t exist in the returned user object', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`)
                .set({ authorization: `Bearer ${token}` });

            expect(response?.body?.data?.user).toBeDefined();
            expect(response.body.data.user.password).not.toBeDefined();
        });

        it('should return errors in the format { error: { message, ...otherErrorInfo }, statusCode }', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`);

            expect(response?.body?.error).toBeDefined();
            expect(response.body.error.message).toBeDefined();
            expect(response.body.statusCode).toBeDefined();
        });

        it('should ensure all correct responses are formatted as JSON and a 2xx status code', async () => {
            const response = await request(app)
                .get(`${USERS_PREFIX}${route}`)
                .set({ authorization: `Bearer ${token}` });

            expect(response.statusCode).toBe(SUCCESS);
            expect(response.headers['content-type']).toEqual(expect.stringContaining('json'));
        });
    });
});