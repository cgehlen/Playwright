import { test, expect } from '@playwright/test';

test('Requisição com API Key', async ({ request }) => {
  const response = await request.get('/api/users', {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'   
    }
  });
  console.log('Status:', response.status());
  console.log('Body:', await response.json());
  expect(response.status()).toBe(200);
});