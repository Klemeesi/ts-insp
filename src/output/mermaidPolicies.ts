import type { MermaidNodeNamePolicy, MermaidSubgraphPolicy, ResultTreeNode } from "../types";

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
