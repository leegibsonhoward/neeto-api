module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globalSetup: './tests/setup.js',
    globalTeardown: './tests/teardown.js',
    setupFilesAfterEnv: ['./tests/setupAfterEnv.js'],
    testMatch: ['**/tests/**/*.test.ts'],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    coverageDirectory: './coverage',
  };
  