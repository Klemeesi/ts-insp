import { CompilerOptions } from "typescript";
import { TraversalPlugin } from "./plugins";
import { log } from "./output/log";

export type OutputFormats = "html" | "console" | "json" | "png";

export interface ImportInfo {
  import: string;
  resolved: boolean;
  absolutePath?: string;
  level: number;
  imports: ImportInfo[];
}

export interface InspOptions {
  /** Verbose... */
  verbose: boolean;
  /** Configuration file for ts-insp. Not supported yet */
  configFile: string;
  /** Which file types are supported. Only relevant if tsconfig.json cannot be located for the source file */
  supportedTypes: string[];
  /** How many traverses are done. How many iterations. */
  iterations: number;
  /** Initial entry point for the traversing */
  file: string;
  /** Defines whether node_modules dependencies are traversed */
  traverseNodeModules?: boolean;
  format: OutputFormats[];
  plugins: TraversalPlugin[];
}

export interface MainOptions {
  inspOptions: InspOptions;
  tsConfigFilePath?: string;
  tsConfigPath?: string;
  compilerOptions?: CompilerOptions;
  logger: typeof log;
}
