import type { InspOptions } from "./src/types.d.ts";

const config: Partial<InspOptions> = {
    verbose: false as boolean,
    supportedTypes: ["ts", "js"],
    file: "src/index.ts",
    traverseNodeModules: false,
    retraverse: false,
    format: ["console", "png"],
    formatOptions: {
        png: {
            outputPath: "docs",
            outputName: "DependencyTree",
            template: "d3dependencyTree",
            customStyles: "body { width: 1200px !important; height: 100% !important; }",
            slugs: {
                diagramWidth: 1000,
                diagramHeight: 1600,
                maxRectWidth: 180,
            },
        },
    },
    plugins: [],
};

export default config;
