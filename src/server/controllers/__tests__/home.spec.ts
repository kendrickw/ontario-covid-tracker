import express from 'express';
import boom from 'express-boom';
import request from 'supertest';

import mockAxios from '~/test-util/mock-axios';

const app = express();
app.use(boom());

beforeAll(() => {
  // Inject node-config stuff
  // process.env.NODE_CONFIG = JSON.stringify({ config });
  const { default: api } = require('~/server/api-routes');
  app.use('/', api);
});

xdescribe('Test /home path', () => {
  const ROOT_PATH = '/home';

  afterEach(() => {
    mockAxios.mockReset();
  });

  test('/ should make http call', async () => {
    const data = { msg: 'expected test result' };
    mockAxios.mockResolvedValueOnce({ data });

    const res = await request(app).post(`${ROOT_PATH}/`);
    expect(res.status).toBe(200);
    expect(mockAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: 'http://localhost:3000/api/home/tobeimplemented',
      })
    );
    expect(res.body).toEqual(data);
  });

  test('/ should fail http call', async () => {
    const err = 'expected test result';
    mockAxios.mockRejectedValueOnce(err);

    const res = await request(app).post(`${ROOT_PATH}/`);
    expect(res.status).toBe(400);
    expect(mockAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'post',
        url: 'http://localhost:3000/api/home/tobeimplemented',
      })
    );
    expect(res.body).toEqual(expect.objectContaining({ err }));
  });
});
