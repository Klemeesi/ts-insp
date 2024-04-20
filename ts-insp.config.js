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
            template: "dependencyTree",
        },
    },
    plugins: [],
};
