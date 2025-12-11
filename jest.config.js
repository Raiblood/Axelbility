module.exports = {
  // Entorno de pruebas
  testEnvironment: 'node',

  // Directorios de prueba
  testMatch: [
    '**/test/**/*.test.js',
    '**/__tests__/**/*.js'
  ],

  // Cobertura de código
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!**/node_modules/**'
  ],

  // Umbral de cobertura
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },

  // Reportes de cobertura
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],

  // Verbose output
  verbose: true,

  // Limpiar mocks automáticamente
  clearMocks: true,

  // Timeout para tests
  testTimeout: 10000
};
