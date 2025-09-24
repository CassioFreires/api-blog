import app from "./app";
import { testConnection } from "./database/ps.database";
import { WebSocket, WebSocketServer } from 'ws';
import http from 'http';

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const connectedClients = new Set<WebSocket>();


wss.on('connection', ws => {
    console.log('Cliente WebSocket conectado');
    connectedClients.add(ws);

    ws.on('message', message => {
        const textMessage = message.toString('utf8');
        console.log('Messagem Recebida: ' + textMessage);

        TODO:

        connectedClients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(textMessage);
            }
        });

        // Remova o cliente quando a conexão for fechada
        ws.on('close', () => {
            console.log('Cliente WebSocket desconectado.');
            connectedClients.delete(ws);
        });

        ws.on('error', error => {
            console.error('Erro no WebSocket:', error);
        });
    })
})

async function start() {
    try {
        await testConnection();
        // ⚠️ Linha para ser alterada ⚠️
        server.listen(3000, () => {
            console.log('Servidor rodando na porta: 3000');
        });
    } catch (error) {
        console.log('Error ao tentar conectar-se ao banco de dados: ' + error);
        throw new Error('Error ao tentar conectar-se ao banco de dados')
    }
}



start();