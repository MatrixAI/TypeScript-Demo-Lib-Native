module.exports = {
  "roots": [
    "<rootDir>/tests"
  ],
  "testMatch": [
    "**/?(*.)+(spec|test|unit.test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    '@library/(.*)$': '<rootDir>/src/lib/$1'
  }
};
