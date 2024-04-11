import * as fs from "fs";
import { ImportInfoV2 } from "../types";

export const generateHtmlPage = (importInfos: ImportInfoV2[], template: string, save?: boolean): string => {
    const templateContent = fs.readFileSync(template, "utf-8");
    const htmlContent = templateContent.replace("<!-- IMPORTS -->", JSON.stringify(importInfos));
    save && fs.writeFileSync("exports/foo.html", htmlContent);
    return htmlContent;
};
