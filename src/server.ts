import app from "./app";
import { connectPostegres } from "./database/ps.database";

async function start() {
    try {
        await connectPostegres();
        app.listen(3000, () => {
            console.log('Servidor rodando na porta: 3000');
        });
    } catch (error) {
        console.log('Error ao tentar conectar-se ao banco de dados: ' + error);
        throw new Error('Error ao tentar conectar-se ao banco de dados')
    }
}


start();