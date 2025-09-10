import path from 'path';

const filePath = path.join('./tests/serverest/assets/gamer.jpg'); 
//teste carione

export async function login(page, email = 'fulano@qa.com', senha = 'teste') {
  await page.getByTestId('email').fill(email);
  await page.getByTestId('senha').fill(senha);
  await page.getByTestId('entrar').click();
  await page.waitForLoadState('networkidle');
}

export async function upload(page) {
  const input = page.locator('input[type="file"]');  
  await input.setInputFiles(filePath);
}

export async function gerarNomeProduto() {
  const nomes = [
    "Sabonete Artesanal", "Perfume Natural", "Creme Hidratante",
    "Shampoo Herbal", "Vela Aromática", "Esfoliante Facial",
    "Óleo Essencial", "Bálsamo Labial", "Condicionador Vegano"
  ];
  return nomes[Math.floor(Math.random() * nomes.length)];
}

export async function gerarDescricao() {
  const descricoes = [
    "Produto 100% natural e vegano.",
    "Feito à mão com ingredientes selecionados.",
    "Ideal para uso diário.",
    "Fragrância suave e refrescante.",
    "Enriquecido com óleos essenciais.",
    "Indicado para todos os tipos de pele."
  ];
  return descricoes[Math.floor(Math.random() * descricoes.length)];
}

export async function gerarPreco(): number {
  return Math.floor(Math.random() * 100) + 1; // preço entre 1 e 100
}

export async function gerarQuantidade() {
  return Math.floor(Math.random() * 50) + 1;
}

export async function gerarNomeUsuario() {
  const nomes = [
    "Pikachu", "Marvel", "Homem-Aranha", "Batman", "Superman", "Mulher-Maravilha",
    "Deadpool", "Coringa", "Flash", "Lanterna Verde", "Wolverine", "Tempestade",
    "Ciclope", "Magneto", "Hulk", "Thor", "Loki", "Capitão América", "Viúva Negra",
    "Gavião Arqueiro", "Doutor Estranho", "Pantera Negra", "Homem de Ferro"
  ];
  return nomes[Math.floor(Math.random() * nomes.length)];
}