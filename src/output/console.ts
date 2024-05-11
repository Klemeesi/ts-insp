import type { ImportInfoV2 } from "../types";

const consoleOutput = async (imports: ImportInfoV2[]) => {
    imports.forEach((i) => {
        const indentation = i.level! > 1 ? "│ ".repeat(i.level! - 1) : "";
        const branch = i.level! > 0 ? "├ " : "";
        const name = i.absolutePath || i.import;
        console.log(`${indentation}${branch}${name}`);
        consoleOutput(i.imports);
    });
};

export const consoleOutputPlugin = () => consoleOutput;
