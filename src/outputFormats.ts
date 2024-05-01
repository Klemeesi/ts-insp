import { consoleOutput } from "./output/console";
import { generateHtmlPage } from "./output/html";
import { generateJson } from "./output/json";
import { generatePng } from "./output/png";
import type { InspOptions, TraversalResult } from "./types";

export const generateOutput = async (result: TraversalResult, options: InspOptions) => {
    if (options.format.some((v) => v === "console")) {
        consoleOutput(result.imports).forEach((line) => console.log(line));
    }

    if (options.format.some((v) => v === "html")) {
        const templatePath = "templates/template1.html";
        generateHtmlPage(result.imports, options);
        console.log("Generated HTML.");
    }

    if (options.format.some((v) => v === "png")) {
        const templatePath = "templates/template1.html";
        await generatePng(result.imports, options);
        console.log("Generated PNG.");
    }

    if (options.format.some((v) => v === "json")) {
        generateJson(result.imports);
        console.log("Generated JSON.");
    }
};
