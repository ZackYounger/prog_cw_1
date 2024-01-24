/* eslint-env jest */
'use strict';

const request = require('supertest');
const app = require('./app');

describe('GET /getPastDaysData service', () => {
  test('GET /getPastDaysData succeeds', () => {
      return request(app)
    .get('/getPastDaysData')
    .expect(200);
  });

  test('GET /getPastDaysData returns JSON', () => {
    return request(app)
  .get('/getPastDaysData')
  .expect('Content-type', /json/);
  });

  test('GET /getPastDaysData returns JSON with parameter', () => {
    return request(app)
  .get('/getPastDaysData?numDays=5')
  .expect('Content-type', /json/);
  });

  test('GET /getFutureDaysData succeeds', () => {
    return request(app)
  .get('/getFutureDaysData')
  .expect(200);
  });

  test('GET /getFutureDaysData returns JSON', () => {
    return request(app)
  .get('/getFutureDaysData')
  .expect('Content-type', /json/);
  });

  test('GET /getFutureDaysData returns JSON with parameter', () => {
    return request(app)
  .get('/getFutureDaysData?numDays=5')
  .expect('Content-type', /json/);
  });

  test('POST /addTask succeeds', () => {
    const params = { taskText: 'Walk the Dog', stringDate: '1|2|2022' };
    return request(app)
    .post('/addTask')
    .send(params)
  .expect(200);
  });

  test('POST /toggleCompletion succeeds', () => {
    const params = { taskText: 'Walk the Dog', stringDate: '1|2|2022' };
    return request(app)
    .post('/toggleCompletion')
    .send(params)
  .expect(200);
  });

  test('POST /removeTask succeeds', () => {
    const params = { taskText: 'Walk the Dog', stringDate: '1|2|2022' };
    return request(app)
    .post('/removeTask')
    .send(params)
  .expect(200);
  });
});
