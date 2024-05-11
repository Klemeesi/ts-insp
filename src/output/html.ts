import * as fs from "fs";
import type { ImportInfoV2, HtmlFormatOptions } from "../types";
import path from "path";

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
    template: "dependencyTree",
};

export const htmlOutputPlugin = (options: HtmlFormatOptions) => async (importInfos: ImportInfoV2[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const templatePath = `templates/${opt.template}.html`;
    const absoluteTemplatePath = path.resolve(__dirname, "../..", templatePath);
    const templateContent = fs.readFileSync(absoluteTemplatePath, "utf-8");
    const output = path.resolve(opt.outputPath, `${opt.outputName}.html`);
    const outputFolder = path.resolve(opt.outputPath);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    const htmlContent = templateContent
        .replace("<!-- IMPORTS -->", JSON.stringify(importInfos, undefined, 2))
        .replace("<!-- CUSTOM-STYLES -->", opt.customStyles || "")
        .replace("<!-- SLUGS -->", opt.slugs ? JSON.stringify(opt.slugs) : "");
    if (!opt.dontSave) {
        fs.writeFileSync(output, htmlContent);
        console.log("Saved", output);
    }
    return Promise.resolve(htmlContent);
};
