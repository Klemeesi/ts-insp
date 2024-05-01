import nodeHtmlToImage from "node-html-to-image";
import type { ImportInfoV2, InspOptions } from "../types";
import { generateHtmlPage } from "./html";
import path from "path";
import fs from "fs";

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
    template: "dependencyTree",
};

export const generatePng = async (imports: ImportInfoV2[], options: InspOptions) => {
    const opt = { ...defaultOptions, ...(options.formatOptions?.png || {}) };
    const output = path.resolve(opt.outputPath, `${opt.outputName}.png`);
    const outputFolder = path.resolve(opt.outputPath);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    nodeHtmlToImage({
        output,
        html: generateHtmlPage(imports, options, "png", false),
    });
};
