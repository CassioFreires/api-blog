import PsDatabase from "../config/ps.config";

export async function connectPostegres() {
    await PsDatabase.initialize()
        .then(() => {
            console.log('📦 Banco de dados "Postgres" conectado com sucesso');
        })
        .catch((error) => {
            console.error('🔴 Erro ao conectar no Postgresql', error);
            throw new Error('Erro ao conectar no Postgresql');
        })
}