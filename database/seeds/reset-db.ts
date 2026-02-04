import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script para resetar o banco de dados com dados iniciais
 * Executa: tsx database/seeds/reset-db.ts
 */
function resetDatabase() {
  const dbPath = join(__dirname, '../db.json');
  const produtosSeedPath = join(__dirname, 'produtos.seed.json');

  try {
    // Lê os produtos do seed
    const produtosSeed = JSON.parse(
      readFileSync(produtosSeedPath, 'utf-8')
    );

    // Cria estrutura inicial do banco
    const db = {
      produtos: produtosSeed,
      pedidos: [],
      pedido_itens: [],
    };

    // Escreve no arquivo db.json
    writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

    console.log('✅ Banco de dados resetado com sucesso!');
    console.log(`📦 ${produtosSeed.length} produtos carregados`);
  } catch (error) {
    console.error('❌ Erro ao resetar banco de dados:', error);
    process.exit(1);
  }
}

resetDatabase();
