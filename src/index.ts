import { traverse } from "./traversal";
import { getConfig } from "./cli/commandLine";
import type { TraversalResult } from "./types";
import { generateOutput } from "./outputFormats";

const main = async () => {
    const config = getConfig();
    const result = traverse(config);
    console.log();
    generateOutput(result, config.inspOptions.format);
};

main();
