import type { MermaidFormatOptions, MermaidLinkPolicy, MermaidNodeNamePolicy, MermaidSubgraphPolicy, ResultTreeNode } from "../types";

const mermaidSubgraphPolicies = {
    none: () => undefined,
    default: (node: ResultTreeNode) => {
        const ap = node.absolutePath || "";
        if (ap.startsWith("node_modules") || node.type === "Unknown") {
            return "node_modules";
        } else {
            const splitted = ap.split("/");
            return splitted[splitted.length - 2] || undefined;
        }
    },
};

const mermaidNodeNamePolicy = {
    default: (node: ResultTreeNode) => node.moduleName,
};

type LinkPolicyArg = typeof mermaidSubgraphPolicies.default;

const mermaidTreeLinkPolicy = {
    default: (getSubgraphName: LinkPolicyArg) => (to?: ResultTreeNode, from?: ResultTreeNode) => {
        if (to && from) {
            return {
                id: `${from?.uniqueId}_${to?.uniqueId}`,
                startId: from?.uniqueId,
                endId: to?.uniqueId,
                linkType: to.type === "Source file" ? "thick" : from.type === "Node module" ? "arrow" : "dotted",
            };
        }
    },
};

const mermaidGraphLinkPolicy = {
    default: (getSubgraphName: LinkPolicyArg) => (to?: ResultTreeNode, from?: ResultTreeNode) => {
        if (!to || !from) {
            return undefined;
        }
        const startGroup = getSubgraphName ? getSubgraphName(from) : undefined;
        const endGroup = getSubgraphName ? getSubgraphName(to) : undefined;
        let startId;
        let endId;
        if (startGroup === endGroup || !startGroup) {
            startId = from.id;
            endId = to.id;
        } else if (startGroup !== endGroup) {
            startId = startGroup;
            endId = endGroup;
        }

        if (startId && endId) {
            return {
                id: `${startId}_${endId}`,
                startId,
                endId,
                linkType: endId === "node_modules" ? "invisible" : "arrow",
            };
        }
    },
};

export const getMermaidGroupNamePolicy = (policy?: MermaidSubgraphPolicy) => {
    if (typeof policy === "function") {
        return policy;
    }
    return (policy && mermaidSubgraphPolicies[policy]) ?? mermaidSubgraphPolicies.default;
};

export const getMermaidNodeNamePolicy = (policy?: MermaidNodeNamePolicy) => {
    if (typeof policy === "function") {
        return policy;
    }
    return (policy && mermaidNodeNamePolicy[policy]) ?? mermaidNodeNamePolicy.default;
};

export const getMermaidLinkPolicy = (opt: MermaidFormatOptions) => {
    const policy = opt.policies?.link as MermaidLinkPolicy;
    if (typeof policy === "function") {
        return policy;
    }

    const subgraphPolicy = getMermaidGroupNamePolicy(opt.policies?.subgraph);

    if (opt.chartType === "tree") {
        return (policy && mermaidTreeLinkPolicy[policy](subgraphPolicy)) ?? mermaidTreeLinkPolicy.default(subgraphPolicy);
    }
    return (policy && mermaidGraphLinkPolicy[policy](subgraphPolicy)) ?? mermaidGraphLinkPolicy.default(subgraphPolicy);
};
