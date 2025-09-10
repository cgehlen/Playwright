import { test, expect } from '@playwright/test';
import { login } from '../../util/helpers.ts';

test('Listar carrinho', async ({ request }) => {
    /**
    * @description Listas carrinhos cadastrados
    * 1. Faz get na rota /carrinhos
    * 2. Valida status code 200
    * 3. Valida que o retorno é um array
    * 4. Valida estrutura mínima de um carrinho 
    * 5. Exibe os carrinhos no console
    */          
  const response = await request.get('/carrinhos');
  expect(response.status()).toBe(200);
  const body = await response.json();  
  // consistência
  expect(Array.isArray(body.carrinhos)).toBe(true);
  // validar estrutura mínima de um produto
  if (body.carrinhos.length > 0) {
    const carrinho = body.carrinhos[0];
    expect(carrinho).toHaveProperty('_id');
    expect(carrinho).toHaveProperty('precoTotal');
    expect(carrinho).toHaveProperty('quantidadeTotal');
    expect(carrinho).toHaveProperty('idUsuario');    
  }  
  console.log("Carrinhos:", JSON.stringify(body.carrinhos, null, 2));
});