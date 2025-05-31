import { traverse } from "./traversal";
import { getConfig } from "./cli/commandLine";
import type { TraversalResult } from "./types";
import { generateOutput } from "./outputFormats";

const main = async () => {
    var success = true;
    const config = getConfig();
    const result = traverse(config);
    if (config.inspOptions.inspectors?.length) {
        console.log();
        for (const inspector of config.inspOptions.inspectors) {
            if (!(await inspector(result))) {
                success = false;
            }
        }

        if (!success) {
            console.error("Some inspectors failed. Please check the output above for details.");
        } else {
            console.log("All inspectors passed successfully.");
        }
    }

    console.log();
    generateOutput(result, config.inspOptions.format);

    if (!success) {
        process.exit(1);
    }
};

main();
