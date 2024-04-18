import { exportPlugin } from "./plugins/debugPlugin";
import { docPlugin } from "./plugins/docPlugin";

export const predefinedPlugins = { debug: exportPlugin, doc: docPlugin };

export type PluginName = keyof typeof predefinedPlugins;
export type PluginProcessor = (typeof predefinedPlugins)[PluginName];
export type TraversalPlugin = { name: PluginName; processor: PluginProcessor };
