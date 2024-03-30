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

export interface TraversalResult {
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
  /** Defines if same module is retraversed. Good to avoid extra clutter and circular dependencies. By default modules are not retraversed */
  retraverse: boolean;
  /** What output formats are done */
  format: OutputFormats[];
  /** Additional plugins. At the time of writing there is only a debug plugin that prints extra debug information about traversal */
  plugins: TraversalPlugin[];
}

export interface MainOptions {
  inspOptions: InspOptions;
  tsConfigFilePath?: string;
  tsConfigPath?: string;
  compilerOptions?: CompilerOptions;
  logger: typeof log;
}
