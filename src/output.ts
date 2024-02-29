import { ImportInfo } from "./types";

export const exportToConsole = (imports: ImportInfo[]) => {
  imports.forEach((i) => {
    const indentation = " ".repeat((i.level - 1) * 2);
    const branch = i.level > 1 ? " └ " : " - ";
    console.log(`${indentation}${branch}${i.import}`);

    exportToConsole(i.imports);
  });
};
