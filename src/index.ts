import { getImports } from "./traversal";
import { getConfig } from "./commandLine";
import type { TraversalResult } from "./types";
import { generateOutput } from "./outputFormats";

const includeTopLevel = (topImport: string, result: TraversalResult): TraversalResult => {
    return {
        ...result,
        imports: [
            {
                id: "root",
                uniqueId: "root",
                import: topImport,
                // absolutePath
                // fullPath
                // Technically could be "Node module" too
                type: "Source file",
                // Incorrect
                extension: "",
                // Incorrect, but lets go with it
                moduleName: topImport,
                resolved: true,
                level: 0,
                imports: result.imports,
            },
        ],
    };
};

const main = async () => {
    const config = getConfig();
    const result = includeTopLevel(config.inspOptions.file, getImports(config, config.inspOptions.file));
    console.log();
    generateOutput(result, config.inspOptions);
};

main();
