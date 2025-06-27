import { ResultTreeNode, MermaidFormatOptions } from "../types";
import { MermaidProcessor } from "./types";

export const getDefaultProcessors = (opt: MermaidFormatOptions): Record<string, MermaidProcessor<ResultTreeNode>> => {
    const getSubgraphName = opt.policies?.subgraph as (node: ResultTreeNode) => string | undefined;
    const getNodeName = opt.policies?.nodeName as (node: ResultTreeNode) => string;

    if (opt.chartType === "tree") {
        return {
            graph: () => ({
                id: "idk",
                dir: opt.dir,
            }),
            node: (current?: ResultTreeNode) => ({
                id: current?.uniqueId!,
                name: getNodeName ? getNodeName(current!) : current?.moduleName,
            }),
            link: (current?: ResultTreeNode, parent?: ResultTreeNode) => {
                if (current && parent) {
                    return {
                        id: `${parent?.uniqueId}_${current?.uniqueId}`,
                        startId: parent?.uniqueId,
                        endId: current?.uniqueId,
                        linkType: current.type === "Source file" ? "thick" : current.type === "Node module" ? "arrow" : "dotted",
                    };
                }
            },
            config: () => ({
                id: "config",
                theme: "default",
                layout: "elk",
            }),
        };
    }
    return {
        graph: () => ({
            id: "idk",
            dir: opt.dir,
        }),
        node: (current?: ResultTreeNode) => {
            if (!current) {
                return undefined;
            }
            return {
                id: current.id!,
                name: getNodeName ? getNodeName(current!) : current?.moduleName,
                groupName: getSubgraphName ? getSubgraphName(current) : undefined,
            };
        },
        link: (current?: ResultTreeNode, parent?: ResultTreeNode) => {
            if (!current || !parent) {
                return undefined;
            }
            const startGroup = getSubgraphName ? getSubgraphName(parent) : undefined;
            const endGroup = getSubgraphName ? getSubgraphName(current) : undefined;
            let startId;
            let endId;
            if (startGroup === endGroup || !startGroup) {
                startId = parent.id;
                endId = current.id;
            } else if (startGroup !== endGroup) {
                startId = startGroup;
                endId = endGroup;
            }

            if (startId && endId) {
                return {
                    id: `${startId}_${endId}`,
                    startId,
                    endId,
                    linkType: "arrow",
                };
            }
        },
        config: () => ({
            id: "config",
            theme: "default",
            layout: "elk",
        }),
    };
};
