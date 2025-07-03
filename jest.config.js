const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  // ⬇️ Adicione isso
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1", // permite usar import from 'src/...' nos testes
  },
  moduleDirectories: ["node_modules", "src"], // permite resolver 'src/' como raiz
};
