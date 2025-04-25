import type { InspOptions } from "./dist/types.d.ts";
import { consoleOutputPlugin } from "./dist/output/console";
import { jsonOutputPlugin } from "./dist/output/json";
import { mermaidOutputPlugin } from "./dist/output/mermaid";

const config: Partial<InspOptions> = {
    verbose: false,
    supportedTypes: ["ts", "js", "d.ts"],
    file: "src/index.ts",
    traverseNodeModules: false,
    retraverse: false,
    format: [
        consoleOutputPlugin(),
        jsonOutputPlugin({
            outputPath: "docs",
            outputName: "JsonExample",
        }),
        mermaidOutputPlugin({
            outputPath: "docs",
            dir: "LR",
            outputName: "MermaidExample",
            chartType: "graph",
            cliOptions: {
                mmdcPathToken: "{mmdc}",
                inputPathToken: "{inputPath}",
                commands: ["{mmdc} -i {inputPath} -o docs\\MermaidExample.svg", "{mmdc} -i {inputPath} -o docs\\MermaidExample.png"],
            },
        }),
    ],
};

export default config;
