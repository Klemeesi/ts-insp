import { exportPlugin } from "./plugins/debugPlugin";

export const predefinedPlugins = { debug: exportPlugin };

export type PluginName = keyof typeof predefinedPlugins;
export type PluginProcessor = (typeof predefinedPlugins)[PluginName];
export type TraversalPlugin = { name: PluginName; processor: PluginProcessor };
