import { program } from "commander";
import type { CommandLineParams, MainOptions } from "./types";
import { getCompilerOptions } from "./tsConfig";
import { log } from "./output/log";
import { getSettingsFromConfigFile } from "./configFileParser";
import { commandLineToInspOptions, mergeOptions, validateInspOptions } from "./helpers/optionMerge";

export const getConfig = (): MainOptions => {
    program
        .name("ts-insp")
        .description("Traverses file imports and does analyzes")
        .option("-f, --file <fileName>", "Root file where the traversal starts")
        .option("-c, --config-file <configFilename>", "Specify the ts-insp config file name (wip)")
        .option("-v, --verbose", "Enable verbose mode", false)
        .option("-s, --supported-types <supportedTypes>", "Supported file types join with comma (,)", "ts,js,tsx,jsx,d.ts")
        .option(
            "-i, --iterations <iterations>",
            "Amount of iterations done for traversal. Be aware that circular imports are bad if number is too large.",
            "5"
        )
        .option("--traverseNodeModules", "Also traversals node module dependencies (might take some time to traversal)", false)
        .option("--retraverse", "Modules are traversed multiple times if encountered during traversal.", false)
        .option("--format <format>", "Format that the inspections are exported. Joined with comma (,)", "console");

    program.parse();

    const options = program.opts<CommandLineParams>();
    const cmdLineOptions = commandLineToInspOptions(options);
    const configFileOptions = options.configFile ? getSettingsFromConfigFile(options.configFile) : {};
    const inspOptions = mergeOptions(cmdLineOptions, configFileOptions);
    validateInspOptions(inspOptions);

    const compilerOptions = getCompilerOptions(inspOptions.file);
    if (!compilerOptions) {
        !!inspOptions.verbose && log("Failed to read tsconfig.json for file ${inspOptions.file}");
    } else {
        !!inspOptions.verbose && log("Using tsconfig.json from: ", compilerOptions.tsConfigFilePath);
    }

    return {
        tsConfigFilePath: compilerOptions?.tsConfigFilePath,
        tsConfigPath: compilerOptions?.tsConfigPath,
        compilerOptions: compilerOptions?.options,
        inspOptions,
        logger: !!inspOptions.verbose ? log : () => {},
    };
};
