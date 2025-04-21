import type { InspOptions } from "./dist/types.d.ts";
import { consoleOutputPlugin } from "./dist/output/console";
import { jsonOutputPlugin } from "./dist/output/json";
import { pngOutputPlugin } from "./dist/output/png";
import { svgOutputPlugin } from "./dist/output/svg";
import { mermaidOutputPlugin } from "./dist/output/mermaid";

const config: Partial<InspOptions> = {
    verbose: false as boolean,
    supportedTypes: ["ts", "js", "d.ts"],
    file: "src/index.ts",
    traverseNodeModules: false,
    retraverse: false,
    format: [
        consoleOutputPlugin(),
        mermaidOutputPlugin({ outputPath: "docs", nodeId: "uniqueId", dir: "LR", outputName: "DependencyGraph" }),
        jsonOutputPlugin({ outputPath: "docs", outputName: "DependencyTree" }),
        pngOutputPlugin({
            outputPath: "docs",
            outputName: "DependencyTree",
            template: "d3dependencyTree",
            customStyles: "body { width: 1200px !important; height: 100% !important; }",
            slugs: {
                diagramWidth: 1000,
                diagramHeight: 1600,
                maxRectWidth: 180,
            },
        }),
        svgOutputPlugin({
            outputPath: "docs",
            outputName: "DependencyTree",
            template: "d3dependencyTree",
            customStyles: "body { width: 1200px !important; height: 100% !important; }",
            slugs: {
                diagramWidth: 1000,
                diagramHeight: 1600,
                maxRectWidth: 180,
            },
        }),
        pngOutputPlugin({
            outputPath: "docs",
            outputName: "DependencyGraph",
            template: "d3dependencyTree",
            customStyles: "body { width: 1200px !important; height: 100% !important; }",
            slugs: {
                diagramWidth: 1000,
                diagramHeight: 1200,
                maxRectWidth: 180,
                graph: true,
            },
        }),
    ],
};

export default config;
