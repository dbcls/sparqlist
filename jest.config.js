module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/frontend/'],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  transform: {
    '^.+\\.m?js$': 'babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/(?!(parse5|entities)/)']
};
