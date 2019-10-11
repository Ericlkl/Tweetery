const request = require('supertest');
const app = require('../app');

// Testing For Tweets API
describe('Tweets API', () => {
  test('Should return the tweets trends', async () => {
    await request(app)
      .get('/api/tweets/trends')
      .query({
        query: 'Spiderman'
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });

  test('Should analyse the tweets emotion and return the result', async () => {
    await request(app)
      .post('/api/tweets/analyse')
      .query({
        query: 'Spiderman'
      })
      .expect('Content-Type', /json/)
      .expect(200);
  });
});
