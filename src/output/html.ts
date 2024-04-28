import * as fs from "fs";
import { ImportInfoV2, InspOptions } from "../types";
import path from "path";

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
    template: "dependencyTree",
};

export const generateHtmlPage = (
    importInfos: ImportInfoV2[],
    options: InspOptions,
    format: "png" | "html" = "html",
    save: boolean = true
): string => {
    const opt = { ...defaultOptions, ...(options.formatOptions?.[format] || {}) };
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
    save && fs.writeFileSync(output, htmlContent);
    return htmlContent;
};
