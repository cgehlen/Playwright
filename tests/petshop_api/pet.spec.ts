import { test, expect } from '@playwright/test';

test('GET pet by id', async ({ request }) => {
  const response = await request.get('/pet/152');
  expect(response.status()).toBe(404); 
  
});

test('Create pet - debug', async ({ request }) => {
  const pet = { id: 991, name: 'Playwright', status: 'available' };

  const response = await request.post('/pet', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: pet
  });

  console.log('STATUS:', response.status());
  console.log('BODY:', await response.text());
});