import { exportPlugin } from "./plugins/debugPlugin";
import { docPlugin } from "./plugins/docPlugin";

export const predefinedPlugins = { debug: exportPlugin, doc: docPlugin };
