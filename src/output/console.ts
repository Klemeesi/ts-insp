import { ImportInfoV2 } from "../types";

export const consoleOutput = (imports: ImportInfoV2[]) => {
    let lines: string[] = [];
    imports.forEach((i) => {
        const indentation = i.level! > 1 ? "│ ".repeat(i.level! - 1) : "";
        const branch = i.level! > 0 ? "├ " : "";
        const name = i.absolutePath || i.import;
        lines = [...lines, `${indentation}${branch}${name}`];
        lines = [...lines, ...consoleOutput(i.imports)];
    });
    return lines;
};
