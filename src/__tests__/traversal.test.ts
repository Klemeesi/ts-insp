import { getImports } from "../traversal";
import { getCompilerOptions } from "../tsConfig";

const testConfig = {
  inspOptions: {
    file: "./src/__tests__/traversal.test.ts",
    configFile: "",
    supportedTypes: ["ts"],
    iterations: 10,
    verbose: false,
    format: [],
    plugins: [],
  },
  logger: () => {},
};

describe("traversal", () => {
  it("Basic traversal test", () => {
    const result = getImports(testConfig, testConfig.inspOptions.file, 1);
    expect(result).toMatchSnapshot();
  });

  it("Traversal test with compiler options", () => {
    const result = getImports(
      {
        ...testConfig,
        compilerOptions: getCompilerOptions("./tsconfig.json")?.options,
      },
      testConfig.inspOptions.file,
      1
    );
    expect(result).toMatchSnapshot();
  });
});
