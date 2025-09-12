
📌 Sobre o Projeto

Este repositório contém testes automatizados de API e Frontend desenvolvidos em Playwright
.
O objetivo é validar funcionalidades da apie fontend Serverest.

🚀 Tecnologias Utilizadas

Node.js

Playwright

TypeScript

Jest/Expect API do Playwright

📂 Estrutura do Projeto
📦 tests/
 ┣ 📂 api/          → Testes de API (CRUD usuários, carrinhos, etc.)
 ┣ 📂 frontend/     → Testes de interface (login, formulários, etc.)
 ┣ 📜 playwright.config.ts
 ┣ 📜 package.json
 ┗ 📜 README.md

▶️ Como Executar
1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

2️⃣ Instalar dependências
npm install

3️⃣ Rodar os testes

Executar todos os testes:

npx playwright test


Executar apenas testes de API:

npx playwright test tests/api


Executar apenas testes de frontend:

npx playwright test tests/frontend


Abrir UI de relatórios:

npx playwright show-report

✅ Exemplos de Casos de Teste
🔹 API – Usuários

Criar usuário com sucesso

Criar usuário com e-mail duplicado (erro esperado)

Listar usuários existentes

Atualizar dados de um usuário

Excluir usuário existente

🔹 API – Carrinhos

Criar carrinho com produto válido

Cancelar carrinho sem token (erro 401)

Cancelar carrinho com token inválido

Validar atualização de estoque após cancelamento

🔹 Frontend

Login com credenciais válidas

Exibir mensagem de erro ao tentar logar com senha inválida

Validar obrigatoriedade dos campos de cadastro

📊 Relatórios

Os testes geram relatórios automáticos via Playwright Reporter, que podem ser abertos com:

npx playwright show-report


Exemplo de relatório:


📝 Licença

Este projeto está sob a licença MIT.
Sinta-se à vontade para utilizar como referência para estudos e portfólio.
