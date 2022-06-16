/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/**/*.test.ts'], // creates matchers for test files
  verbose: true, // allows tests to be reported
  forceExit: true, // allows running tests to be exited
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
