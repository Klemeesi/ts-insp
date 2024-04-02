import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { ImportInfo, MainOptions, TraversalResult } from "./types";

interface Import {
    importPath: string;
    normalizedPath: string;
    absolutePath?: string;
}

const isNodeModule = (absolutePath: string) => absolutePath.search("node_modules") != -1;

/**
 * If the filepath can be resolved (tsconfig located) returns one item.
 * Otherwise uses supportedTypes from configuration and gives couple of options to try
 *
 * Future improvement: Try to locate the file in here. Not outside!
 *
 * @param options yeah
 * @param normalizedPath what the ts file had imported
 * @param filePath source file path
 * @returns Array of options where the file could be located
 */
const resolveImportPaths = (options: MainOptions, normalizedPath: string, filePath: string): string[] => {
    if (options.compilerOptions) {
        const resolvedImportPath = ts.resolveModuleName(normalizedPath, filePath, options.compilerOptions, ts.sys).resolvedModule
            ?.resolvedFileName;
        if (resolvedImportPath) {
            return [resolvedImportPath];
        }
    }

    return options.inspOptions.supportedTypes.map((t) => path.resolve(path.dirname(filePath), normalizedPath + "." + t));
};

const getImportsFromNode = (options: MainOptions, filePath: string, childNode: ts.Node, sourceFile: ts.SourceFile): Import | undefined => {
    if (ts.isImportDeclaration(childNode)) {
        const importPath = childNode.moduleSpecifier.getText(sourceFile);
        // Remove quotes around import path
        const normalizedPath = importPath.substring(1, importPath.length - 1);
        const resolvedImportPaths = resolveImportPaths(options, normalizedPath, filePath) || normalizedPath;
        // We don't know the exact extension of the file, so we try all supported types to find it.
        // Would be good to optimize this somehow
        // Doesn't find e.g. "fs" since it is node module
        const absolutePath = resolvedImportPaths.find((p) => fs.existsSync(p));

        return { importPath, normalizedPath, absolutePath };
    }
    return undefined;
};

const getImportsFromFile = (options: MainOptions, filePath: string, currentLevel: number): ImportInfo[] => {
    const result: ImportInfo[] = [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    options.logger("Traversing file:", filePath);

    ts.forEachChild(sourceFile, (childNode) => {
        // Run plugins
        options.inspOptions.plugins.forEach((plugin) => {
            options.logger(`Running ${plugin.name} plugin for`, filePath);
            plugin.processor(childNode, filePath, options.inspOptions);
        });

        const importInfo = getImportsFromNode(options, filePath, childNode, sourceFile);

        if (importInfo) {
            // Child node has an import
            options.logger("Found import:", importInfo.normalizedPath, `(${importInfo.absolutePath})`);
            result.push({
                import: importInfo.absolutePath || importInfo.normalizedPath,
                resolved: !!importInfo.absolutePath,
                absolutePath: importInfo.absolutePath,
                level: currentLevel,
                imports: [],
            });
        }
    });
    return result;
};

// Limit the number of iterations based on options
// Only process import if absolutePath is known. For some modules we don't know the absolutePath (like "fs")
// Limit node_modules traversal based on options
const shouldTraverse = (options: MainOptions, info: ImportInfo, importCounts: Record<string, number>) =>
    info.level < options.inspOptions.iterations &&
    info.absolutePath &&
    (options.inspOptions.traverseNodeModules || !isNodeModule(info.absolutePath)) &&
    (options.inspOptions.retraverse || !importCounts[info.import]);

// Second try with the function. Original was recursive and pretty complex method to modify.
// This one is supposed to be easier to read and not be recursive.
export const getImports = (options: MainOptions, filePath: string): TraversalResult => {
    const result: TraversalResult = { imports: [] };
    const importCounts: Record<string, number> = {};
    let nextBatchToProcess = [
        {
            parent: result,
            imports: getImportsFromFile(options, filePath, 1),
        },
    ];

    while (nextBatchToProcess.length) {
        const batch = [...nextBatchToProcess];
        nextBatchToProcess = [];

        batch.forEach((oneSet) => {
            const { parent } = oneSet;
            // Update parent imports. Mutates the object
            parent.imports = [...parent.imports, ...oneSet.imports];
            // Go thru each import and traverse them
            oneSet.imports.forEach((i) => {
                if (shouldTraverse(options, i, importCounts)) {
                    // If the import should be traversed, add it to the next batch
                    nextBatchToProcess = [
                        ...nextBatchToProcess,
                        {
                            parent: i,
                            imports: getImportsFromFile(options, i.absolutePath!, i.level + 1),
                        },
                    ];
                }
            });
            // Keep track of the import counts. Important if user has enabled retraversal
            oneSet.imports.forEach((i) => {
                importCounts[i.import] = importCounts[i.import] ? importCounts[i.import] + 1 : 1;
            });
        });
    }

    Object.keys(importCounts).forEach((key) => options.logger(key, "imported", importCounts[key], "times"));

    return result;
};
