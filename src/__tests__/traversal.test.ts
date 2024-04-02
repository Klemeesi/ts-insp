import { getImports } from "../traversal";
import { getCompilerOptions } from "../tsConfig";

const testConfig = {
    inspOptions: {
        file: "./src/__tests__/traversal.test.ts",
        configFile: "",
        supportedTypes: ["ts"],
        iterations: 10,
        verbose: false,
        retraverse: true,
        format: [],
        plugins: [],
    },
    logger: () => {},
};

describe("traversal", () => {
    it("Basic traversal test", () => {
        const result = getImports(testConfig, testConfig.inspOptions.file);
        expect(result.imports).toMatchSnapshot();
    });

    it("Traversal test with compiler options", () => {
        const result = getImports(
            {
                ...testConfig,
                compilerOptions: getCompilerOptions("./tsconfig.json")?.options,
            },
            testConfig.inspOptions.file
        );
        expect(result.imports).toMatchSnapshot();
    });
});
