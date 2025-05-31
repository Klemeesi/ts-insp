import { ResultTreeNode, TraversalResult } from "../types";

export const circularDependencyInspector = () => async (result: TraversalResult) => {
    const circularDependencies: string[] = [];
    const visited = new Set<string>();

    const checkCircularDependency = (node: ResultTreeNode, path: string[]) => {
        if (visited.has(node.uniqueId)) {
            if (path.includes(node.uniqueId)) {
                circularDependencies.push(`Circular dependency detected: ${[...path, node.uniqueId].join(" -> ")}`);
            }
            return;
        }

        visited.add(node.uniqueId);
        path.push(node.uniqueId);

        for (const child of node.imports) {
            checkCircularDependency(child, path);
        }

        path.pop();
    };

    for (const node of result.imports) {
        checkCircularDependency(node, []);
    }

    if (circularDependencies.length > 0) {
        console.error("Circular dependencies found:");
        circularDependencies.forEach((dep) => console.error(dep));
        return false;
    }

    console.log("No circular dependencies found.");
    return true;
};
