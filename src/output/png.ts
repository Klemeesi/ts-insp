import nodeHtmlToImage from "node-html-to-image";
import { ImportInfo } from "../types";
import { generateHtmlPage } from "./html";

export const generatePng = async (imports: ImportInfo[], templatePath: string) => {
    nodeHtmlToImage({
        output: "./exports/rendered_html.png",
        html: generateHtmlPage(imports, templatePath),
    });
};
