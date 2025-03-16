const config = {  
  automock: false, // Automatically mock all modules unless specified otherwise  
  
  collectCoverage: true, // Enable code coverage collection  
  collectCoverageFrom: [  
    "src/v1/**/*.{ts,tsx}", // Include TypeScript files in src/v1/  
    "src/v1/**/*.{js,jsx}", // Include JavaScript files in src/v1/  
    "!src/v1/config/**/*.{ts,tsx}", // Exclude config files from coverage  
    "!src/v1/utils/logger.{ts,js}", // Exclude logger utility from coverage  
    "!vendor/**/*.{js,jsx}", // Exclude vendor folder  
    "!**/node_modules/**", // Exclude node_modules  
  ],  
  
  coverageProvider: "babel", // Use Babel as the coverage provider  
  
  coverageThreshold: {  
    global: {    
      branches: 10,  // Minimum branch coverage percentage  
      functions: 10,  // Minimum function coverage percentage  
      lines: 10,  // Minimum line coverage percentage  
      statements: 10  // Minimum statement coverage percentage  
    }  
  },  
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],  
  moduleNameMapper: {    
    "^#(.*)$": "<rootDir>/src/v1/$1" // Map module imports with "#" alias to src/v1/  
  },  
  transform: {    
    "^.+\\.tsx?$": [    
      "ts-jest",  // Use ts-jest to transform TypeScript files  
      {    
        useESM: false, // Disable ECMAScript Modules support  
      }    
    ]    
  },    
  
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ECMAScript Modules  
  
  testMatch: ['**/__tests__/**/*.test.ts'],  
  
  maxConcurrency: 5, // Limit the number of test files that run in parallel  
  
  preset: "ts-jest", // Use ts-jest preset for TypeScript support  
  
  testEnvironment: "node", // Use Node.js as the test environment  
  
  verbose: true, // Display detailed test results  
};  
  
export default config;