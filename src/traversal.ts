import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { ImportInfo, MainOptions } from "./types";
import { log } from "./output/log";

const isNodeModule = (absolutePath: string) =>
  absolutePath.search("node_modules") != -1;

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
const resolveImportPaths = (
  options: MainOptions,
  normalizedPath: string,
  filePath: string
): string[] => {
  if (options.compilerOptions) {
    const resolvedImportPath = ts.resolveModuleName(
      normalizedPath,
      filePath,
      options.compilerOptions,
      ts.sys
    ).resolvedModule?.resolvedFileName;
    if (resolvedImportPath) {
      return [resolvedImportPath];
    }
  }

  return options.inspOptions.supportedTypes.map((t) =>
    path.resolve(path.dirname(filePath), normalizedPath + "." + t)
  );
};

const traverseImports = (
  options: MainOptions,
  filePath: string,
  sourceFile: ts.SourceFile,
  currentLevel: number
) => {
  const { iterations, verbose, supportedTypes } = options.inspOptions;
  let imports: ImportInfo[] = [];
  if (currentLevel > iterations) {
    // Limit the depth of import traversal
    return;
  }
  log(verbose, "Traversing file: ", filePath);

  ts.forEachChild(sourceFile, (childNode) => {
    if (ts.isImportDeclaration(childNode)) {
      const importPath = childNode.moduleSpecifier.getText(sourceFile);
      // Remove quotes around import path
      const normalizedPath = importPath.substring(1, importPath.length - 1);
      const resolvedImportPaths =
        resolveImportPaths(options, normalizedPath, filePath) || normalizedPath;

      log(verbose, "Found import: ", resolvedImportPaths);

      // Left here for... idk, I'm bad with paths
      // ATM moved to resolveImportPaths function
      /*
      const possiblePaths = supportedTypes.map((t) =>
        path.resolve(path.dirname(filePath), resolvedImportPath + "." + t)
      );
      */

      // TODO: It would be nice to check if possiblePaths are reletive or not. Preferrably all the paths are in the same format

      const absolutePath = resolvedImportPaths.find((p) => fs.existsSync(p));
      if (absolutePath) {
        imports = [
          ...imports,
          {
            import: absolutePath,
            resolved: true,
            absolutePath,
            level: currentLevel,
            imports:
              options.inspOptions.traverseNodeModules ||
              !isNodeModule(absolutePath)
                ? getImports(options, absolutePath, currentLevel + 1)
                : [],
          },
        ];
      } else {
        imports = [
          ...imports,
          {
            import: normalizedPath,
            resolved: false,
            level: currentLevel,
            imports: [],
          },
        ];
      }
    }
  });
  return imports;
};

export const getImports = (
  options: MainOptions,
  filePath: string,
  level: number
) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest
  );

  return traverseImports(options, filePath, sourceFile, level || 1) || [];
};
