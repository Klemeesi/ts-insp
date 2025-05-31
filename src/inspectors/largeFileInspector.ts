import { ResultTreeNode, TraversalResult } from "../types";

export const largeFileInspector =
    (sizeThreshold: number = 1000000) =>
    async (result: TraversalResult) => {
        const largeFiles: ResultTreeNode[] = [];
        const blacklistTypes = ["Node module", "Unknown"];

        const checkFileSize = (node: ResultTreeNode) => {
            if (node.properties.size && parseInt(node.properties.size, 10) > sizeThreshold && !blacklistTypes.includes(node.type)) {
                largeFiles.push(node);
            }
            for (const child of node.imports) {
                checkFileSize(child);
            }
        };

        for (const node of result.imports) {
            checkFileSize(node);
        }

        if (largeFiles.length > 0) {
            console.error("Large files found:");
            largeFiles.forEach((file) => console.error(`- ${file.fullPath || file.absolutePath} (${file.properties.size} bytes)`));
            return false;
        }

        console.log("No large files found.");
        return true;
    };
