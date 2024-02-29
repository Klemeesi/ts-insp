import * as fs from "fs";
import { program } from "commander";
import { InspOptions } from "./types";

type CommandLineParams = {
  [K in keyof InspOptions]: string;
};

export const getConfig = (): InspOptions => {
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

  return {
    verbose: options.verbose === "true",
    configFile: options.configFile,
    supportedTypes: options.supportedTypes.split(","),
    levelLimit: +options.levelLimit,
    file: options.file,
  };
};
