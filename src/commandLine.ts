import * as fs from "fs";
import { program } from "commander";
import { InspOptions, MainOptions, OutputFormats } from "./types";
import { getCompilerOptions } from "./tsConfig";
import { log } from "./output/log";
import { PluginName, TraversalPlugin, predefinedPlugins } from "./plugins";

type CommandLineParams = {
    [K in keyof InspOptions]: string;
};

export const getConfig = (): MainOptions => {
    program
        .name("ts-insp")
        .description("Traverses file imports and does analyzes")
        .option("-f, --file <fileName>", "Root file where the traversal starts")
        .option("-c, --config-file <configFilename>", "Specify the ts-insp config file name (not supported)")
        .option("-v, --verbose", "Enable verbose mode", false)
        .option("-s, --supported-types <supportedTypes>", "Supported file types join with comma (,)", "ts,js,tsx,jsx,d.ts")
        .option(
            "-i, --iterations <iterations>",
            "Amount of iterations done for traversal. Be aware that circular imports are bad if number is too large.",
            "5"
        )
        .option("--traverseNodeModules", "Also traversals node module dependencies (might take some time to traversal)", false)
        .option("--retraverse", "Modules are traversed multiple times if encountered during traversal.", false)
        .option("--format <format>", "Format that the inspections are exported. Joined with comma (,)", "console")
        .option(
            "-p, --plugins <plugins>",
            "Plugins used in traversal. Only predefined plugins are supported in CLI. Joined with comma (,)",
            ""
        );

    program.parse();

    const options = program.opts<CommandLineParams>();

    if (!options.file) {
        console.error("Please provide a TypeScript file path as an argument.");
        process.exit(-1);
    }

    if (!fs.existsSync(options.file)) {
        console.error("File does not exist:", options.file);
        process.exit(-1);
    }

    let plugins: TraversalPlugin[] = [];
    if (options.plugins) {
        plugins = options.plugins
            .split(",")
            .map((name) => ({
                name: name as unknown as PluginName,
                processor: predefinedPlugins[name as PluginName],
            }))
            .filter((p) => !!p.processor);
    }

    !!options.verbose && log("Number of traversal plugins:", plugins.length);

    const compilerOptions = getCompilerOptions(options.file);
    if (!compilerOptions) {
        !!options.verbose && log("Failed to read tsconfig.json for file ${options.file}");
    } else {
        !!options.verbose && log("Using tsconfig.json from: ", compilerOptions.tsConfigFilePath);
    }

    return {
        tsConfigFilePath: compilerOptions?.tsConfigFilePath,
        tsConfigPath: compilerOptions?.tsConfigPath,
        compilerOptions: compilerOptions?.options,
        inspOptions: {
            verbose: !!options.verbose,
            configFile: options.configFile,
            supportedTypes: options.supportedTypes.split(","),
            iterations: +options.iterations,
            file: options.file,
            traverseNodeModules: !!options.traverseNodeModules,
            retraverse: !!options.retraverse,
            format: options.format.split(",") as OutputFormats[],
            plugins,
        },
        logger: !!options.verbose ? log : () => {},
    };
};
