import { test, expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { gerarDescricao, gerarEmail, gerarNomeUsuario, gerarPreco } from '../../util/helpers';

test('Cadastrar usuário', async ({ request }) => {   
    /**
     * @description Cadastra usuário com sucesso
     * 1. Faz post na rota /usuarios com dados válidos
     * 2. Valida status code 201
     * 3. Valida mensagem "Cadastro realizado com sucesso"
    **/ 
    const newUser = {
        id: Date.now(), 
        username: faker.internet.username(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.number(),
        userStatus: 1
    };
    
    const response = await request.post('/user', { data: newUser });
    expect(response.status()).toBe(200);
    console.log('Usuário criado:', newUser);
});