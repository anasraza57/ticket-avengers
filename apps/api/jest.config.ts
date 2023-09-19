/* eslint-disable */
export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coveragePathIgnorePatterns: ['serverless.ts', 'serverless.base.ts'],
  coverageDirectory: '../../coverage/apps/api',
  collectCoverageFrom: ['src/**/*.ts']
};
