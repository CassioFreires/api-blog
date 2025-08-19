import db from "../config/ps.config";

export async function testConnection() {
  try {
    await db.raw('SELECT 1+1 AS result');
    console.log('✅ Banco de dados conectado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra a aplicação
  }
}
