import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs";
import { ImportInfo } from "./types";

const supportedTypes = ["ts", "js", "tsx", "jsx", "d.ts"];
const levelLimit = 5;
const verbose = true;

const log = (enable: boolean, ...data: any[]) =>
  enable && console.debug("ts-insp >", ...data);

const traverseImports = (
  filePath: string,
  sourceFile: ts.SourceFile,
  currentLevel: number
) => {
  let imports: ImportInfo[] = [];

  log(verbose, "Traversing file: ", filePath);
  if (currentLevel > levelLimit) return; // Limit the depth of import traversal
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
            imports: getImports(absolutePath, currentLevel + 1),
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

export const getImports = (filePath: string, level: number) => {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const sourceFile = ts.createSourceFile(
    filePath,
    fileContent,
    ts.ScriptTarget.Latest
  );

  return traverseImports(filePath, sourceFile, level || 1) || [];
};
export { ImportInfo };
