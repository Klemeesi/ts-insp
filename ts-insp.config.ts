import type { InspOptions } from "./dist/types.d.ts";
import { consoleOutputPlugin } from "./dist/output/console";
import { jsonOutputPlugin } from "./dist/output/json";
import { mermaidOutputPlugin } from "./dist/output/mermaid";
import { circularDependencyInspector } from "./dist/inspectors/circularDependencyInspector";
import { largeFileInspector } from "./dist/inspectors/largeFileInspector";

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
            policies: {
                subgraph: "default",
                nodeName: "default",
            },
            cliOptions: {
                mmdcPathToken: "{mmdc}",
                inputPathToken: "{inputPath}",
                commands: ["{mmdc} -i {inputPath} -o docs\\MermaidExample.svg", "{mmdc} -i {inputPath} -o docs\\MermaidExample.png"],
            },
        }),
    ],
    inspectors: [circularDependencyInspector(), largeFileInspector(10000)],
};

export default config;
