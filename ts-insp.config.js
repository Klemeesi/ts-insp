module.exports = {
    verbose: false,
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
                diagramHeight: 1500,
                maxRectWidth: 180,
            },
        },
    },
    plugins: [],
};
