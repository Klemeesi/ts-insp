import type { CompilerOptions, SourceFile, Node } from "typescript";

export type OutputFormats = "console" | "json" | "mermaid";

export type PluginName = "debug" | "doc";
export type PluginProcessor = (node: Node, sourceFile: SourceFile, key: string, options: MainOptions) => void;
export type TraversalPlugin = { name: PluginName; processor: PluginProcessor };

export type OutputFormatPlugin = (imports: ResultTreeNode[]) => Promise<unknown>;

type ImportType = "Node module" | "Source file" | "Unknown";
type Logger = (...data: any[]) => void;

export interface ResultTreeNode {
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
    imports: ResultTreeNode[];
    // Properties for the node. Can be used to store additional information about the node.
    properties: Record<string, string>;
}

export interface TraversalResult {
    imports: ResultTreeNode[];
}

export interface JsonFormatOptions {
    outputPath?: string;
    outputName?: string;
}

export type MermaidSubgraphPolicy = "none" | "default" | ((node: ResultTreeNode) => string | undefined);
export type MermaidNodeNamePolicy = "default" | ((node: ResultTreeNode) => string);

export interface MermaidFormatOptions extends JsonFormatOptions {
    dir?: "TB" | "BT" | "LR" | "RL";
    chartType?: "tree" | "graph";
    cliOptions?: MermaidCliOptions;
    policies?: {
        subgraph?: MermaidSubgraphPolicy;
        nodeName?: MermaidNodeNamePolicy;
    };
}

export interface MermaidCliOptions {
    mmdcPathToken?: string;
    inputPathToken?: string;
    outputPathToken?: string;
    commands?: string[];
}

type Inspector = (result: TraversalResult) => Promise<boolean>;

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
    filterModules?: (node: ResultTreeNode, parent?: ResultTreeNode) => boolean;
    /** What output formats are done */
    format: OutputFormatPlugin[];
    /** Inspectors that are run after traversing analysizing the results */
    inspectors?: Inspector[];
}

export interface InspConfig extends Partial<InspOptions> {}

export interface MainOptions {
    inspOptions: InspOptions;
    tsConfigFilePath?: string;
    tsConfigPath?: string;
    compilerOptions?: CompilerOptions;
    logger: Logger;
}
