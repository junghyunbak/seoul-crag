import type { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    '^@/(.*)': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
};

export default config;
