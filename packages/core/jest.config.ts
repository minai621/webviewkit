import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "@constants/(.*)": "<rootDir>/src/constants/$1",
    "@utils/(.*)": "<rootDir>/src/utils/$1",
    "@types/(.*)": "<rootDir>/src/types/$1",
    "@detectors/(.*)": "<rootDir>/src/detectors/$1",
  },
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
  },
  testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(spec|test).ts?(x)"],

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};

export default config;
