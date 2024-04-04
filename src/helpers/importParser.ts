import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { MainOptions } from "../types";

export interface Import {
    importPath: string;
    normalizedPath: string;
    absolutePath?: string;
}

/**
 * If the filepath can be resolved (tsconfig located) returns one item.
 * Otherwise uses supportedTypes from configuration and try all options
 *
 * @param options yeah
 * @param normalizedPath what the ts file had imported
 * @param filePath source file path
 * @returns Array of options where the file could be located
 */
const resolveImportPath = (options: MainOptions, normalizedPath: string, filePath: string): string | undefined => {
    if (options.compilerOptions) {
        const module = ts.resolveModuleName(normalizedPath, filePath, options.compilerOptions, ts.sys).resolvedModule;
        if (module) {
            return (module as unknown as ts.ProjectReference).originalPath || module.resolvedFileName;
        }
    }

    // If compilerOptions are not defined or resolving failed
    const pathOptions = options.inspOptions.supportedTypes.map((t) => path.resolve(path.dirname(filePath), normalizedPath + "." + t));
    // We don't know the exact extension of the file, so we try all supported types to find it.
    // Would be good to optimize this somehow
    // Doesn't find e.g. "fs" since it is node module
    return pathOptions.find((p) => fs.existsSync(p));
};

export const getImportsFromNode = (options: MainOptions, filePath: string, node: ts.Node, sourceFile: ts.SourceFile): Import[] => {
    let results: Import[] = [];
    let importPath: string | undefined;
    let knownImport = false;

    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        importPath = node.moduleSpecifier?.getText(sourceFile);
        knownImport = true;
    } else if (ts.isCallExpression(node)) {
        const text = node.getText(sourceFile);
        if ((text.includes("require") || text.includes("import")) && node.arguments.length > 0 && node.arguments[0]) {
            importPath = node.arguments[0].getText(sourceFile);
        }
    }
    if (importPath) {
        // Remove quotes around import path
        const normalizedPath = importPath.substring(1, importPath.length - 1);

        const absolutePath = resolveImportPath(options, normalizedPath, filePath);
        if (absolutePath || knownImport) {
            results = [...results, { importPath, normalizedPath, absolutePath }];
        }
    }

    // Check also child nodes since code files are trees
    ts.forEachChild(node, (childNode: ts.Node) => {
        results = [...results, ...getImportsFromNode(options, filePath, childNode, sourceFile)];
    });

    return results;
};
