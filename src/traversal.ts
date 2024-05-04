import * as ts from "typescript";
import * as fs from "fs";
import type { ImportInfoV2, MainOptions, TraversalResult } from "./types";
import { getImportsFromNode } from "./helpers/importParser";
import { getCommentsFromFile } from "./helpers/commentParser";

const isNodeModule = (absolutePath: string) => absolutePath.search("node_modules") != -1;
const defaultFilterModules = () => true;

const getImportsFromFile = (options: MainOptions, filePath: string, currentLevel: number): ImportInfoV2[] => {
    const result: ImportInfoV2[] = [];
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const sourceFile = ts.createSourceFile(filePath, fileContent, ts.ScriptTarget.Latest, true);

    options.logger("Traversing file:", filePath);

    ts.forEachChild(sourceFile, (childNode) => {
        // Run plugins
        options.inspOptions.plugins.forEach((plugin) => {
            options.logger(`Running ${plugin.name} plugin for`, filePath);
            plugin.processor(childNode, sourceFile, filePath, options);
        });

        const importInfos = getImportsFromNode(options, filePath, childNode, sourceFile);

        importInfos.forEach((importInfo) => {
            // Child node has an import
            options.logger("Found import:", importInfo.import, `(${importInfo.absolutePath})`);
            result.push({
                ...importInfo,
                level: currentLevel,
            });
        });
    });
    return result;
};

// Limit the number of iterations based on options
// Only process import if absolutePath is known. For some modules we don't know the absolutePath (like "fs")
// Limit node_modules traversal based on options
const shouldTraverse = (options: MainOptions, info: ImportInfoV2, importCounts: Record<string, number>) =>
    info.level! < options.inspOptions.iterations &&
    info.absolutePath &&
    (options.inspOptions.traverseNodeModules || !isNodeModule(info.absolutePath)) &&
    (options.inspOptions.retraverse || !importCounts[info.id]);

// Second try with the function. Original was recursive and pretty complex method to modify.
// This one is supposed to be easier to read and not be recursive.
export const getImports = (options: MainOptions, filePath: string): TraversalResult => {
    const result: TraversalResult = { imports: [] };
    const importCounts: Record<string, number> = {};
    const filterModules = options.inspOptions.filterModules || defaultFilterModules;
    let nextBatchToProcess = [
        {
            parent: result,
            parentInfo: undefined as ImportInfoV2 | undefined,
            imports: getImportsFromFile(options, filePath, 1),
        },
    ];

    while (nextBatchToProcess.length) {
        const batch = [...nextBatchToProcess];
        nextBatchToProcess = [];

        batch.forEach((oneSet) => {
            const { parent, parentInfo } = oneSet;

            // Filter imports before adding them to parent
            const newImports = oneSet.imports.filter((i) => {
                return filterModules(i, parentInfo);
            });

            // Update parent imports. Mutates the object
            parent.imports = [...parent.imports, ...newImports];
            // Go thru each import and traverse them
            newImports.forEach((i) => {
                i.alreadyTraversed = !!importCounts[i.id];
                if (shouldTraverse(options, i, importCounts)) {
                    // If the import should be traversed, add it to the next batch
                    nextBatchToProcess = [
                        ...nextBatchToProcess,
                        {
                            parent: i,
                            parentInfo: { ...i, imports: [] },
                            imports: getImportsFromFile(options, i.absolutePath!, i.level! + 1),
                        },
                    ];
                }
            });
            // Keep track of the import counts. Important if user has enabled retraversal
            oneSet.imports.forEach((i) => {
                importCounts[i.id] = importCounts[i.id] ? importCounts[i.id] + 1 : 1;
            });
        });
    }

    Object.keys(importCounts).forEach((key) => options.logger(key, "imported", importCounts[key], "times"));

    return result;
};
