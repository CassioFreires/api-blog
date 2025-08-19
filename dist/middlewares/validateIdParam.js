"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = validateIdParam;
function validateIdParam(paramName) {
    return (req, res, next) => {
        const value = req.params[paramName];
        if (!value || isNaN(Number(value))) {
            res.status(400).json({
                message: `Parâmetro '${paramName}' inválido ou ausente.`
            });
            return; // só retorna para sair da função, sem retornar o Response
        }
        // opcional: converte para número e sobrescreve no params
        req.params[paramName] = Number(value).toString();
        next(); // segue para o próximo middleware/controller
    };
}
