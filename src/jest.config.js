module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    moduleFileExtensions: ["js", "json", "ts"],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    transform: {
      "^.+\\.tsx?$": ["ts-jest", { tsconfig: "test/tsconfig.json" }],
    },

  };