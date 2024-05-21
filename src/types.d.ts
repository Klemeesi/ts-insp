import type { CompilerOptions, SourceFile, Node } from "typescript";

export type OutputFormats = "html" | "console" | "json" | "png" | "svg";

export type PluginName = "debug" | "doc";
export type PluginProcessor = (node: Node, sourceFile: SourceFile, key: string, options: MainOptions) => void;
export type TraversalPlugin = { name: PluginName; processor: PluginProcessor };

export type OutputFormatPlugin = (imports: ImportInfoV2[]) => Promise<unknown>;

type ImportType = "Node module" | "Source file" | "Unknown";
type Logger = (...data: any[]) => void;

export interface ImportInfoV2 {
    // Same as absolutePath
    id: string;
    // Globally unique identifier for the file
    uniqueId: string;
    // Name of the import as in the source file
    import: string;
    // Absolute path relative to project root
    absolutePath?: string;
    // Full path relative to disk root
    fullPath?: string;
    // Was the traversal stopped for this node. Usually same module is not retraversed.
    alreadyTraversed: boolean;
    // Type of the file
    type: ImportType;
    // File extension
    extension: string;
    // Name of the module.
    moduleName: string;
    // Level that the file was traversed
    level?: number;
    // Was this file traversed
    resolved: boolean;
    // Child imports
    imports: ImportInfoV2[];
    // Description parsed from the file
    description?: string;
    // Git href
    gitHref?: string;
}

export interface TraversalResult {
    imports: ImportInfoV2[];
}

export interface JsonFormatOptions {
    outputPath?: string;
    outputName?: string;
}

export interface HtmlFormatOptions extends JsonFormatOptions {
    template?: string;
    customStyles?: string;
    slugs?: { [key: string]: unknown };
    // Only relevant for HTML output format
    dontSave?: boolean;
}

export interface PngFormatOptions extends HtmlFormatOptions {}

export interface InspOptions {
    /** Verbose... */
    verbose?: boolean;
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
    /** Skip type imports */
    skipTypeImports?: boolean;
    /** Defines if same module is retraversed. Good to avoid extra clutter and circular dependencies. By default modules are not retraversed */
    retraverse?: boolean;
    /** Return false to filter out results. By default everything is included */
    filterModules?: (node: ImportInfoV2, parent?: ImportInfoV2) => boolean;
    /** What output formats are done */
    format: OutputFormatPlugin[];
    /** Additional plugins. At the time of writing there is only a debug plugin that prints extra debug information about traversal */
    plugins: TraversalPlugin[];
}

export interface InspConfig extends Partial<InspOptions> {}

export interface MainOptions {
    inspOptions: InspOptions;
    tsConfigFilePath?: string;
    tsConfigPath?: string;
    compilerOptions?: CompilerOptions;
    logger: Logger;
}

export type CommandLineParams = {
    [K in keyof InspOptions]: string;
};
