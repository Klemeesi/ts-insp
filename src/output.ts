import { ImportInfo } from "./types";

export const exportToConsole = (imports: ImportInfo[]) => {
  imports.forEach((i) => {
    const indentation = i.level > 1 ? "│ ".repeat(i.level - 1) : "";
    const branch = i.level > 0 ? "├ " : "";
    console.log(`${indentation}${branch}${i.import}`);
    exportToConsole(i.imports);
  });
};
