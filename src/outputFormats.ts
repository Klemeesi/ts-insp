import type { TraversalResult, OutputFormatPlugin } from "./types";
import { consoleOutputPlugin } from "./output/console";
import { jsonOutputPlugin } from "./output/json";
import { mermaidOutputPlugin } from "./output/mermaid";

const emptyPlugin: OutputFormatPlugin = async () => {};
const defaultPlugins: Record<string, OutputFormatPlugin> = {
    mermaid: mermaidOutputPlugin({}),
    json: jsonOutputPlugin({}),
    console: consoleOutputPlugin(),
};

export const generateOutput = async (result: TraversalResult, outputFormatPlugins: OutputFormatPlugin[]) => {
    outputFormatPlugins.forEach(async (plugin) => {
        await plugin(result.imports);
    });
};

export const getDefaultPlugin = (pluginName: string) => (defaultPlugins[pluginName] ? defaultPlugins[pluginName] : emptyPlugin);
