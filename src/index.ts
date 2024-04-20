import { getImports } from "./traversal";
import { consoleOutput } from "./output/console";
import { getConfig } from "./commandLine";
import { generateHtmlPage } from "./output/html";
import { generateJson } from "./output/json";
import { generatePng } from "./output/png";
import { TraversalResult } from "./types";

const includeTopLevel = (topImport: string, result: TraversalResult): TraversalResult => {
    return {
        ...result,
        imports: [
            {
                id: "root",
                uniqueId: "root",
                import: topImport,
                // absolutePath
                // fullPath
                // Technically could be "Node module" too
                type: "Source file",
                // Incorrect
                extension: "",
                // Incorrect, but lets go with it
                moduleName: topImport,
                resolved: true,
                level: 0,
                imports: result.imports,
            },
        ],
    };
};

const main = async () => {
    const config = getConfig();

    const result = includeTopLevel(config.inspOptions.file, getImports(config, config.inspOptions.file));

    console.log();

    if (config.inspOptions.format.some((v) => v === "console")) {
        consoleOutput(result.imports).forEach((line) => console.log(line));
    }

    // Test code for now. Generated with ChatGPT
    if (config.inspOptions.format.some((v) => v === "html")) {
        const templatePath = "templates/template1.html";
        generateHtmlPage(result.imports, config.inspOptions);
        console.log("Generated HTML.");
    }

    if (config.inspOptions.format.some((v) => v === "png")) {
        const templatePath = "templates/template1.html";
        await generatePng(result.imports, config.inspOptions);
        console.log("Generated PNG.");
    }

    if (config.inspOptions.format.some((v) => v === "json")) {
        generateJson(result.imports);
        console.log("Generated JSON.");
    }
};

main();
