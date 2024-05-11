import { getDefaultPlugin } from "../outputFormats";
import { predefinedPlugins } from "../plugins";
import type { CommandLineParams, InspOptions, OutputFormats, PluginName, TraversalPlugin } from "../types";
import * as fs from "fs";

const mergeArrays = <T>(arr1: T[] = [], arr2: T[] = []): T[] => (arr2.length > 0 ? arr2 : arr1);

export const validateInspOptions = (options: InspOptions) => {
    if (!options.file) {
        console.error("Please provide a TypeScript file path as an argument.");
        process.exit(-1);
    }

    if (!fs.existsSync(options.file)) {
        console.error("File does not exist:", options.file);
        process.exit(-1);
    }
};

export const commandLineToInspOptions = (options: CommandLineParams): InspOptions => {
    return {
        verbose: !!options.verbose,
        configFile: options.configFile,
        supportedTypes: options.supportedTypes.split(","),
        iterations: +options.iterations,
        file: options.file,
        traverseNodeModules: !!options.traverseNodeModules,
        retraverse: !!options.retraverse,
        format: options.format.split(",").map((name) => getDefaultPlugin(name)),
        filterModules: () => true,
        plugins: options.plugins
            .split(",")
            .map((name) => ({
                name: name as unknown as PluginName,
                processor: predefinedPlugins[name as PluginName],
            }))
            .filter((p) => !!p.processor),
    };
};

export const mergeOptions = (cmdLineOptions: InspOptions, configFileOptions: Partial<InspOptions>): InspOptions => {
    return {
        ...configFileOptions,
        verbose: cmdLineOptions.verbose || configFileOptions.verbose,
        configFile: cmdLineOptions.configFile,
        supportedTypes: mergeArrays(cmdLineOptions.supportedTypes, configFileOptions.supportedTypes),
        iterations: cmdLineOptions.iterations || configFileOptions.iterations || 5,
        file: cmdLineOptions.file || configFileOptions.file!,
        traverseNodeModules: !!cmdLineOptions.traverseNodeModules || configFileOptions.traverseNodeModules,
        filterModules: configFileOptions.filterModules,
        retraverse: !!cmdLineOptions.retraverse || configFileOptions.retraverse,
        format: mergeArrays(cmdLineOptions.format, configFileOptions.format),
        plugins: mergeArrays(cmdLineOptions.plugins, configFileOptions.plugins),
    };
};
