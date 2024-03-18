import * as fs from "fs";
import { program } from "commander";
import { InspOptions, MainOptions, OutputFormats } from "./types";
import { getCompilerOptions } from "./output/tsConfig";
import { log } from "./output/log";

type CommandLineParams = {
  [K in keyof InspOptions]: string;
};

export const getConfig = (): MainOptions => {
  program
    .name("ts-insp")
    .description("Traverses file imports and does analyzes")
    .option("-f, --file <fileName>", "Root file where the traversal starts")
    .option(
      "-c, --config-file <configFilename>",
      "Specify the ts-insp config file name (not supported)"
    )
    .option("-v, --verbose", "Enable verbose mode", false)
    .option(
      "-s, --supported-types <supportedTypes>",
      "Supported file types join with comma (,)",
      "ts,js,tsx,jsx,d.ts"
    )
    .option(
      "-i, --iterations <iterations>",
      "Amount of iterations done for traversal",
      "5"
    )
    .option(
      "--traverseNodeModules",
      "Also traversals node module dependencies (might take some time to traversal)",
      false
    )
    .option(
      "--format <format>",
      "Format that the inspections are exported. Joined with comma (,)",
      "console,html,png"
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

  const compilerOptions = getCompilerOptions(options.file);
  if (!compilerOptions) {
    log(
      !!options.verbose,
      "Failed to read tsconfig.json for file ${options.file}"
    );
  } else {
    log(
      !!options.verbose,
      "Using tsconfig.json from: ",
      compilerOptions.tsConfigFilePath
    );
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
      format: options.format.split(",") as OutputFormats[],
    },
  };
};
