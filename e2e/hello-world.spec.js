
const { test, expect } = require('@playwright/test');

const APP_URL = process.env.APP_URL || 'http://44.192.123.80';

test('Social Lite home page returns the expected response', async ({ request }) => {
  const response = await request.get(`${APP_URL}/`);

  expect(response.status()).toBe(200);
  await expect(response).toBeOK();

  const body = await response.json();

  expect(body.application).toBe('Social Lite');
  expect(body.message).toBe('Hello World');
  expect(body.status).toBe('running');
});

test('Social Lite health endpoint is healthy', async ({ request }) => {
  const response = await request.get(`${APP_URL}/health`);

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({ status: 'healthy' });
});
