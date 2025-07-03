"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockResponse = createMockResponse;
// Cria um mock da resposta do Express com os métodos mais usados
function createMockResponse() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
}
