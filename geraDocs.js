import fs from "fs";
import path from "path";

const pastaTestes = "./tests";
const saida = "./DOCUMENTACAO.md";

/**
 * Extrai docstrings /** ... *\/ de um arquivo
 */
function extrairDocstrings(conteudo) {
  const regex = /\/\*\*([\s\S]*?)\*\//g;
  let docs = [];
  let match;

  while ((match = regex.exec(conteudo)) !== null) {
    let texto = match[1]
      .split("\n")
      .map(l => l.replace(/^\s*\* ?/, "")) // remove "*"
      .join("\n")
      .trim();

    docs.push(texto);
  }

  return docs;
}

/**
 * Lê arquivos de testes e monta a documentação
 */
function gerarDocumentacao(pasta) {
  let resultado = "# 📖 Documentação dos Testes\n\n";

  const arquivos = fs.readdirSync(pasta);

  for (const arquivo of arquivos) {
    const caminho = path.join(pasta, arquivo);
    const stat = fs.statSync(caminho);

    if (stat.isDirectory()) {
      resultado += gerarDocumentacao(caminho);
    } else if (arquivo.endsWith(".ts") || arquivo.endsWith(".js")) {
      const conteudo = fs.readFileSync(caminho, "utf8");
      const docs = extrairDocstrings(conteudo);

      if (docs.length > 0) {
        resultado += `## Arquivo: \`${arquivo}\`\n\n`;
        docs.forEach((d, i) => {
          resultado += `### Caso ${i + 1}\n${d}\n\n`;
        });
      }
    }
  }

  return resultado;
}

const doc = gerarDocumentacao(pastaTestes);
fs.writeFileSync(saida, doc, "utf8");
console.log("✅ Documentação gerada em", saida);
