import { getImports } from "./traversal";
import { consoleOutput } from "./output/console";
import { getConfig } from "./commandLine";
import { generateHtmlPage } from "./output/html";
import { generateJson } from "./output/json";
import { generatePng } from "./output/png";

const main = async () => {
  const config = getConfig();

  const imports = [
    {
      import: config.inspOptions.file,
      resolved: true,
      level: 0,
      imports: getImports(config, config.inspOptions.file, 1),
    },
  ];
  console.log();

  if (config.inspOptions.format.some((v) => v === "console")) {
    consoleOutput(imports).forEach((line) => console.log(line));
  }

  // Test code for now. Generated with ChatGPT
  if (config.inspOptions.format.some((v) => v === "html")) {
    const templatePath = "templates/template1.html";
    generateHtmlPage(imports, templatePath, true);
    console.log("Generated HTML.");
  }

  if (config.inspOptions.format.some((v) => v === "png")) {
    const templatePath = "templates/template1.html";
    await generatePng(generateHtmlPage(imports, templatePath));
    console.log("Generated PNG.");
  }

  if (config.inspOptions.format.some((v) => v === "json")) {
    generateJson(imports);
    console.log("Generated JSON.");
  }
};

main();
