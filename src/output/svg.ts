import puppeteer from "puppeteer";
import type { ImportInfo, PngFormatOptions } from "../types";
import { htmlOutputPlugin } from "./html";
import path from "path";
import fs from "fs";

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const styleBlock = '<style type="text/css"><![CDATA[%1]]></style>';

const defaultOptions = {
    outputPath: "exports",
    outputName: "export",
    template: "dependencyTree",
};

export const svgOutputPlugin = (options: PngFormatOptions) => async (imports: ImportInfo[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath, `${opt.outputName}.svg`);
    const outputFolder = path.resolve(opt.outputPath);

    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setContent(await htmlOutputPlugin({ ...options, dontSave: true })(imports));

    // Wait until the JavaScript code has fully rendered
    await page.waitForFunction(
        () => {
            const svg = document.querySelector("svg");
            if (!svg) {
                return false;
            }
            return (
                svg.childElementCount > 0 &&
                !Array.from(svg.children).some((child) => getComputedStyle(child).getPropertyValue("display") === "none")
            );
        },
        { timeout: 5000 }
    );

    const svgContent = await page.evaluate(() => {
        const svg = document.querySelector("svg");
        return svg?.outerHTML;
    });

    const styleContent = await page.evaluate(() => {
        const style = document.querySelector("html > head > style");
        return style?.innerHTML;
    });

    await browser.close();

    if (svgContent) {
        const style = styleBlock.replace("%1", styleContent || " ");
        const content =
            xmlHeader +
            "\r\n" +
            svgContent
                .replace(/></g, ">\r\n<")
                .replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')
                .replace("\r\n", `\r\n${style}\r\n`);

        fs.writeFileSync(output, content);
        console.log("Saved", output);
    } else {
        console.log("Error: Failed to extract svg element.");
    }
};
