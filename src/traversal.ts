import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { ImportInfo, InspOptions } from "./types";

const log = (enable: boolean, ...data: any[]) =>
  enable && console.debug("ts-insp >", ...data);

const traverseImports = (
  options: InspOptions,
  filePath: string,
  sourceFile: ts.SourceFile,
  currentLevel: number
) => {
  const { iterations, verbose, supportedTypes } = options;
  let imports: ImportInfo[] = [];
  if (currentLevel > iterations) {
    // Limit the depth of import traversal
    return;
  }
  log(options.verbose, "Traversing file: ", filePath);

  ts.forEachChild(sourceFile, (childNode) => {
    if (ts.isImportDeclaration(childNode)) {
      const importPath = childNode.moduleSpecifier.getText(sourceFile);
      const normalizedPath = importPath.substring(1, importPath.length - 1); // Remove quotes around import path

      log(verbose, "Found import: ", normalizedPath);

      const possiblePaths = supportedTypes.map((t) =>
        path.resolve(path.dirname(filePath), normalizedPath + "." + t)
      );

      const absolutePath = possiblePaths.find((p) => fs.existsSync(p));
      if (absolutePath) {
        imports = [
          ...imports,
          {
            import: normalizedPath,
            resolved: true,
            absolutePath,
            level: currentLevel,
            imports: getImports(options, absolutePath, currentLevel + 1),
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
  options: InspOptions,
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
export { ImportInfo };
