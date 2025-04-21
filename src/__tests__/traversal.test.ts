import { getImports } from "../traversal";
import { getCompilerOptions } from "../tsConfig";
import type { ImportInfoV2 } from "../types";

jest.mock("uuid", () => ({
    v4: jest.fn().mockReturnValue("mocked-uuid"), // Return a fixed ID 'mocked-uuid'
}));

const testConfig = {
    inspOptions: {
        file: "./src/__mocks__/traversal/root.ts",
        configFile: "",
        supportedTypes: ["ts", "js", "d.ts"],
        iterations: 10,
        verbose: false,
        retraverse: false,
        format: [],
    },
    logger: () => {},
    compilerOptions: getCompilerOptions("./tsconfig.json")?.options,
};

describe("traversal", () => {
    it("Basic traversal snapshot", () => {
        const result = getImports({ ...testConfig, compilerOptions: undefined }, testConfig.inspOptions.file);
        expect(result.imports).toMatchSnapshot();
    });

    it("Traversal with compiler options", () => {
        const result = getImports(testConfig, testConfig.inspOptions.file);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports[0].moduleName).toBe("fs");
        expect(result.imports[1].moduleName).toBe("submodule2");
        expect(result.imports[1].imports[0].moduleName).toBe("typescript");
        expect(result.imports[1].imports[1].moduleName).toBe("submodule1");
    });

    it("Traversal with retraverse", () => {
        const config = { ...testConfig, inspOptions: { ...testConfig.inspOptions, retraverse: true } };
        const result = getImports(config, testConfig.inspOptions.file);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports[0].moduleName).toBe("fs");
        expect(result.imports[1].moduleName).toBe("submodule2");
        expect(result.imports[1].imports[0].moduleName).toBe("typescript");
        expect(result.imports[1].imports[1].moduleName).toBe("submodule1");
        expect(result.imports[1].imports[1].imports[0].moduleName).toBe("fs");
    });

    it("Traversal with traverseNodeModules", () => {
        const config = { ...testConfig, inspOptions: { ...testConfig.inspOptions, traverseNodeModules: true } };
        const result = getImports(config, "./src/__mocks__/traversal/folder/submodule3.ts");
        expect(result.imports[0].moduleName).toBe("node-html-to-image");
        expect(result.imports[0].imports.length).toBeGreaterThan(0);
    });

    it("traversal with verbose", () => {
        const mockLog = jest.fn();
        const config = { ...testConfig, inspOptions: { ...testConfig.inspOptions, verbose: true }, logger: mockLog };
        getImports(config, testConfig.inspOptions.file);
        expect(mockLog).toHaveBeenCalled();
    });

    it("traversal with 1 iteration", () => {
        const config = { ...testConfig, inspOptions: { ...testConfig.inspOptions, iterations: 1 } };
        const result = getImports(config, testConfig.inspOptions.file);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports.length).toBe(0);
        expect(result.imports[1].moduleName).toBe("submodule2");
        expect(result.imports[1].imports.length).toBe(0);
    });

    it("traversal with supportedTypes", () => {
        const config = { ...testConfig, inspOptions: { ...testConfig.inspOptions, supportedTypes: ["ts"] } };
        const result = getImports(config, testConfig.inspOptions.file);
        expect(result.imports.length).toBe(1);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports.length).toBe(1);
        expect(result.imports[0].imports[0].moduleName).toBe("fs");
    });

    it("traversal with filterModules", () => {
        const config = {
            ...testConfig,
            inspOptions: {
                ...testConfig.inspOptions,
                filterModules: (a: ImportInfoV2) => {
                    return !a.absolutePath?.includes("node_modules");
                },
            },
        };
        const result = getImports(config, testConfig.inspOptions.file);
        expect(result.imports.length).toBe(2);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports.length).toBe(1);
        expect(result.imports[0].imports[0].moduleName).toBe("fs");
        expect(result.imports[1].moduleName).toBe("submodule2");
        expect(result.imports[1].imports.length).toBe(1);
        expect(result.imports[1].imports[0].moduleName).toBe("submodule1");
    });

    it("traversal with skipTypeImports", () => {
        const config = {
            ...testConfig,
            inspOptions: {
                ...testConfig.inspOptions,
                skipTypeImports: true,
            },
        };
        const result = getImports(config, testConfig.inspOptions.file);
        expect(result.imports.length).toBe(1);
        expect(result.imports[0].moduleName).toBe("submodule1");
        expect(result.imports[0].imports.length).toBe(1);
        expect(result.imports[0].imports[0].moduleName).toBe("fs");
    });
});
