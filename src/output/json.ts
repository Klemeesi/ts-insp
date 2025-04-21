import path from "path";
import type { ImportInfo, JsonFormatOptions } from "../types";
import * as fs from "fs";

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
};

export const jsonOutputPlugin = (options: JsonFormatOptions) => async (imports: ImportInfo[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath, `${opt.outputName}.json`);
    const outputFolder = path.resolve(opt.outputPath);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    fs.writeFileSync(output, JSON.stringify(imports, undefined, 2));
    console.log("Saved", output);
    return Promise.resolve();
};
