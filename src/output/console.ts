import { ImportInfo } from "../types";

export const consoleOutput = (imports: ImportInfo[]) => {
    let lines: string[] = [];
    imports.forEach((i) => {
        const indentation = i.level > 1 ? "│ ".repeat(i.level - 1) : "";
        const branch = i.level > 0 ? "├ " : "";
        lines = [...lines, `${indentation}${branch}${i.import}`];
        lines = [...lines, ...consoleOutput(i.imports)];
    });
    return lines;
};
