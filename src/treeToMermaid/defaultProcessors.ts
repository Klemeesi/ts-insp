import { ResultTreeNode, MermaidFormatOptions } from "../types";
import { MermaidProcessor } from "./types";

export const getDefaultProcessors = (opt: MermaidFormatOptions): Record<string, MermaidProcessor<ResultTreeNode>> => {
    const getSubgraphName = opt.policies?.subgraph as (node: ResultTreeNode) => string | undefined;
    const getNodeName = opt.policies?.nodeName as (node: ResultTreeNode) => string;
    const getLink = opt.policies?.link as (
        to?: ResultTreeNode,
        from?: ResultTreeNode
    ) => { id: string; startId: string; endId: string; linkType: string } | undefined;

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
            link: getLink,
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
        link: getLink,
        config: () => ({
            id: "config",
            theme: "default",
            layout: "elk",
        }),
    };
};
