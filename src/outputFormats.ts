import type { TraversalResult, OutputFormatPlugin } from "./types";
import { consoleOutputPlugin } from "./output/console";
import { htmlOutputPlugin } from "./output/html";
import { jsonOutputPlugin } from "./output/json";
import { pngOutputPlugin } from "./output/png";
import { svgOutputPlugin } from "./output/svg";
import { mermaidOutputPlugin } from "./output/mermaid";

const emptyPlugin: OutputFormatPlugin = async () => {};
const defaultPlugins: Record<string, OutputFormatPlugin> = {
    mermaid: mermaidOutputPlugin({}),
    png: pngOutputPlugin({}),
    html: htmlOutputPlugin({}),
    json: jsonOutputPlugin({}),
    console: consoleOutputPlugin(),
    svg: svgOutputPlugin({}),
};

export const generateOutput = async (result: TraversalResult, outputFormatPlugins: OutputFormatPlugin[]) => {
    outputFormatPlugins.forEach(async (plugin) => {
        await plugin(result.imports);
    });
};

export const getDefaultPlugin = (pluginName: string) => (defaultPlugins[pluginName] ? defaultPlugins[pluginName] : emptyPlugin);
