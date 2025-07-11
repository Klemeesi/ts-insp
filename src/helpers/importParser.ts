import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { createHash, randomBytes } from "crypto";
import type { ResultTreeNode, MainOptions } from "../types";

const getType = (absolutePath?: string) =>
    absolutePath?.includes("node_modules") ? "Node module" : absolutePath ? "Source file" : "Unknown";

interface ImportPaths {
    moduleName: string;
    fullPath: string;
    extension: string;
    absolutePath: string;
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
const resolveImportPath = (options: MainOptions, normalizedPath: string, filePath: string): ImportPaths | undefined => {
    let absolutePath: string | undefined = undefined;
    let extension: string = "";
    let moduleName: string | undefined = undefined;
    if (options.compilerOptions) {
        const module = ts.resolveModuleName(normalizedPath, filePath, options.compilerOptions, ts.sys).resolvedModule;
        if (module) {
            absolutePath = (module as unknown as ts.ProjectReference).originalPath || module.resolvedFileName;
            moduleName = module.packageId?.name;
            extension = module.extension;
        }
    }

    if (!absolutePath) {
        // If compilerOptions are not defined or resolving failed
        const pathOptions = options.inspOptions.supportedTypes.map((t) => path.resolve(path.dirname(filePath), normalizedPath + "." + t));
        // We don't know the exact extension of the file, so we try all supported types to find it.
        // Would be good to optimize this somehow
        // Doesn't find e.g. "fs" since it is node module
        absolutePath = pathOptions.find((p) => fs.existsSync(p));

        const lastPathPart = absolutePath?.split("/")?.pop() || "";
        const fileNameParts = lastPathPart.split(".");
        fileNameParts.shift();
        extension = "." + fileNameParts?.join(".") || "";
    }
    if (absolutePath) {
        const fullPath = path.resolve(absolutePath);
        if (!moduleName) {
            moduleName = absolutePath.split("/").pop()?.replace(extension, "") || normalizedPath;
        }
        return {
            moduleName,
            extension,
            absolutePath,
            fullPath,
        };
    }
};

const generateId = (input?: string): string => {
    const hash = createHash("md5");
    hash.update(input ?? randomBytes(16).toString());
    return hash.digest("hex");
};

export const getImportsFromNode = (options: MainOptions, filePath: string, node: ts.Node, sourceFile: ts.SourceFile): ResultTreeNode[] => {
    let results: ResultTreeNode[] = [];
    let importPath: string | undefined;
    let knownImport = false;

    if (ts.isImportDeclaration(node)) {
        if (!options.inspOptions.skipTypeImports || !node.importClause?.isTypeOnly) {
            importPath = node.moduleSpecifier?.getText(sourceFile);
            knownImport = true;
        }
    } else if (ts.isExportDeclaration(node)) {
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

        const paths = resolveImportPath(options, normalizedPath, filePath);
        const extensionMatches = !paths?.extension || options.inspOptions.supportedTypes.some((e) => `.${e}` === paths.extension);

        if (!extensionMatches) {
            options.logger("Skipped", paths?.absolutePath || normalizedPath, "due to supportedTypes");
        }

        if (extensionMatches && (paths?.absolutePath || knownImport)) {
            results = [
                ...results,
                {
                    id: generateId(paths?.absolutePath || normalizedPath),
                    uniqueId: generateId(),
                    import: normalizedPath,
                    extension: paths?.extension || "",
                    alreadyTraversed: false,
                    fullPath: paths?.fullPath,
                    type: getType(paths?.absolutePath),
                    moduleName: paths?.moduleName || normalizedPath,
                    resolved: !!paths,
                    absolutePath: paths?.absolutePath,
                    imports: [],
                    properties: paths?.absolutePath ? getProperties(paths?.absolutePath) : {},
                },
            ];
        }
    }

    // Check also child nodes since code files are trees
    ts.forEachChild(node, (childNode: ts.Node) => {
        results = [...results, ...getImportsFromNode(options, filePath, childNode, sourceFile)];
    });

    return results;
};

export const getProperties = (filePath: string): Record<string, string> => {
    const properties: Record<string, string> = {};
    const fileStats = fs.statSync(filePath);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    properties["size"] = fileStats.size.toString();
    properties["created"] = fileStats.birthtime.toISOString();
    properties["modified"] = fileStats.mtime.toISOString();
    properties["path"] = filePath;
    properties["lines"] = fileContent.split("\n").length.toString();
    return properties;
};
