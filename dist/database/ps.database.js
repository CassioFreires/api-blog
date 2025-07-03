"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectPostegres = connectPostegres;
const ps_config_1 = __importDefault(require("../config/ps.config"));
function connectPostegres() {
    return __awaiter(this, void 0, void 0, function* () {
        yield ps_config_1.default.initialize()
            .then(() => {
            console.log('📦 Banco de dados "Postgres" conectado com sucesso');
        })
            .catch((error) => {
            console.error('🔴 Erro ao conectar no Postgresql', error);
            throw new Error('Erro ao conectar no Postgresql');
        });
    });
}
