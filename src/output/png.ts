import nodeHtmlToImage from "node-html-to-image";
import type { ImportInfo, PngFormatOptions } from "../types";
import { htmlOutputPlugin } from "./html";
import path from "path";
import fs from "fs";

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
    template: "dependencyTree",
};

export const pngOutputPlugin = (options: PngFormatOptions) => async (imports: ImportInfo[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath, `${opt.outputName}.png`);
    const outputFolder = path.resolve(opt.outputPath);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    nodeHtmlToImage({
        output,
        html: await htmlOutputPlugin({ ...options, dontSave: true })(imports),
    });
    console.log("Saved", output);
};
