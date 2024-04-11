import nodeHtmlToImage from "node-html-to-image";
import { ImportInfoV2 } from "../types";
import { generateHtmlPage } from "./html";

export const generatePng = async (imports: ImportInfoV2[], templatePath: string) => {
    nodeHtmlToImage({
        output: "./exports/rendered_html.png",
        html: generateHtmlPage(imports, templatePath),
    });
};
