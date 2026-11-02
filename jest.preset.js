const path = require('path');

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@ql/common/(.*)$': path.resolve(__dirname, 'libs/common/src/$1'),
    '^@ql/common$': path.resolve(__dirname, 'libs/common/src'),
    '^@ql/contracts/(.*)$': path.resolve(__dirname, 'libs/contracts/src/$1'),
    '^@ql/contracts$': path.resolve(__dirname, 'libs/contracts/src'),
    '^@ql/config/(.*)$': path.resolve(__dirname, 'libs/config/src/$1'),
    '^@ql/config$': path.resolve(__dirname, 'libs/config/src'),
    '^@ql/logger/(.*)$': path.resolve(__dirname, 'libs/logger/src/$1'),
    '^@ql/logger$': path.resolve(__dirname, 'libs/logger/src'),
    '^@ql/exceptions/(.*)$': path.resolve(__dirname, 'libs/exceptions/src/$1'),
    '^@ql/exceptions$': path.resolve(__dirname, 'libs/exceptions/src'),
    '^@ql/messaging/(.*)$': path.resolve(__dirname, 'libs/messaging/src/$1'),
    '^@ql/messaging$': path.resolve(__dirname, 'libs/messaging/src'),
    '^@ql/database/(.*)$': path.resolve(__dirname, 'libs/database/src/$1'),
    '^@ql/database$': path.resolve(__dirname, 'libs/database/src'),
  },
};

