# 📖 Documentação dos Testes

# 📖 Documentação dos Testes

# 📖 Documentação dos Testes

# 📖 Documentação dos Testes

## Arquivo: `carrinhos.spec.ts`

### Caso 1
@description Lista carrinhos cadastrados - cada usuário pode ter no máximo 1 carrinho
1. Faz GET na rota /carrinhos
2. Valida status code 200
3. Valida que o retorno contém quantidade e carrinhos
4. Valida que `carrinhos` é um array com no máximo 1 item
5. Se existir, valida estrutura mínima do carrinho e de seus produtos
6. Exibe os carrinhos no console

### Caso 2
@description Lista carrinho com id 
1. Faz get na rota /carrinhos/id
2. Valida status code 400
3. Deveria validar a mensagem de erro, mas a API está retornando mensagem genérica
4. Exibe o retorno no console
Obs: O id do carrinho deve ter exatamente 16 caracteres alfanuméricos, caso contrário retorna erro 400.

### Caso 3
@description Cadastrar carrinho com sucesso. O carrinho é vinculado ao usuário do token enviado no header Authorization, 
sendo possível cadastrar apenas 1 carrinho por usuário.
1. Exclui carrinho existente (se houver) para garantir estado inicial
2. Faz POST na rota /carrinhos
3. Valida status code 201
4. Valida mensagem de sucesso e existência do id do carrinho

### Caso 4
@description Cadastrar carrinho e validar que não existe produto duplicado 
1. Exclui carrinho existente (se houver) para garantir estado inicial
2. Faz POST na rota /carrinhos com dois produtos iguais
3. Valida status code 400
4. Valida mensagem dque carinho nao pode ter produto duplicado

### Caso 5
@description Cadastrar carrinho com produto inexistente
1. Exclui carrinho existente (se houver) para garantir estado inicial
2. Faz POST na rota /carrinhos com produto inexistente
3. Valida status code 400
4. Valida mensagem de produto não encontrado

### Caso 6
@description Cadastrar carrinho com produto sem estoque suficiente
1. Exclui carrinho existente (se houver) para garantir estado inicial
2. Faz POST na rota /carrinhos com produto sem estoque suficiente
3. Valida status code 400
4. Valida mensagem de produto sem estoque suficiente

### Caso 7
@description Cadastrar carrinho com produto zerado
1. Exclui carrinho existente (se houver) para garantir estado inicial
2. Faz POST na rota /carrinhos com produto sem quntidade
3. Valida status code 400
4. Não é possível validar a mensagem, pois a API está retornando mensagem de que o produto nao contem valor obrigatório

### Caso 8
@description Cadastrar carrinho e validar que não pode ter mais de um carrinho
1. Cria primeiro carrinho (se não houver)
2. Tenta criar segundo carrinho
3. Valida status code 400
4. Valida a mensagem que não é permitido ter mais de 1 carrinho

### Caso 9
@description Cadastrar carrinho sem token, inválido ou inexistente
1. Faz post na rota /carrinhos sem token
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 10
@description Cancelar carrinho sem token, inválido ou inexistente
1. Faz post na rota /carrinhos sem token
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 11
@description Cancelar carrinho token inválido
1. Faz post na rota /carrinhos com token invalido 
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 12
@description Cancelar carrinho token expirado
1. Faz post na rota /carrinhos com token expirado (simulado) 
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 13
@description Valida se ao cancelar uma compra o carrinho é excluído e o estoque dos produtos desse carrinho é reabastecido.
1. Faz get na rota /produtos/{id} para pegar o estoque inicial
2. Cria um carrinho com esse produto
3. Faz get na rota /produtos/{id} para validar que o estoque diminuiu
4. Cancela o carrinho
5. Faz get na rota /produtos/{id} para validar que o estoque voltou ao valor inicial

### Caso 14
@description Deleta carrinho ao concluir compra
1. Cria um carrinho 
2. Cancela o carrinho
3. Faz get na rota /carrinhos para validar que o carrinho foi excluído

### Caso 15
@description Concluir compra com token de usuario que não possui carrinho
1. Cria um novo usuário
2. Faz login para obter token
3. Tenta concluir compra
4. Valida mensagem "Não foi encontrado carrinho para esse usuário"

### Caso 16
@description Concluir compra sem token, inválido ou inexistente
1. Faz post na rota /carrinhos sem token
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 17
@description Concluir compra token inválido
1. Faz post na rota /carrinhos com token invalido 
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

### Caso 18
@description Concluir compra token expirado
1. Faz post na rota /carrinhos com token expirado (simulado) 
2. Valida status code 401
3. Valida a mensagem que token de acesso ausente, inválido, expirado ou usuário do token não existe mais

## Arquivo: `produtos.spec.ts`

### Caso 1
@description Cadastrar produtos
1. Faz post na rota /produtos
2. Valida status code 200
3. Valida que o produto foi criado com sucesso

### Caso 2
@description Editar produtos
1. Faz put na rota /produtos
2. Valida status code 200
3. Valida que o produto foi editado com sucesso

### Caso 3
@description Excluir produtos
1. Faz delete na rota /produtos
2. Valida status code 200
3. Valida que o produto foi excluido com sucesso

### Caso 4
@description Excluir produtos
1. Faz delete na rota /produtos
2. Valida status code 200
3. Valida que o produto foi excluido com sucesso

### Caso 5
@description Listar produtos
1. Faz get na rota /produtos
2. Valida status code 200
3. Lista os produtos

### Caso 6
@description Lista produto por id
1. Faz get na rota /produtos
2. Valida status code 200
3. Valida que o produto foi encontrado com sucesso

### Caso 7
@description Lista produtos - id inexistente para validar a mensagem de erro
1. Faz get na rota /produtos
2. Valida status code 200
3. Valida que o produto foi editado com sucesso

