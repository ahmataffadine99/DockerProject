/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node', // Indique à Jest que nous testons un environnement Node.js
  setupFiles: ['dotenv/config'], // Charge les variables d'environnement avant les tests
  testMatch: [ // Spécifie où Jest doit chercher les fichiers de test
    '**/tests/**/*.test.js', // Recherche les fichiers .test.js dans les sous-dossiers 'tests'
  ],
  // Optionnel: si vous avez des modules ES (import/export), vous pourriez avoir besoin de Babel
  // transform: {
  //   '^.+\\.js$': 'babel-jest',
  // },
};

module.exports = config;