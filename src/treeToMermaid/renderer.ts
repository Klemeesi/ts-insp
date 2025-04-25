import { uniques } from "../helpers";
import { renderOrder, renderTokens } from "./tokenRenderers";

import { MermaidProcessor, MermaidRenderOptions, MermaidToken } from "./types";

const extractChildren = <T>(node: T, options?: MermaidRenderOptions<T>): T[] => {
    return options?.extractChildren?.(node) || (node as { children: T[] }).children || [];
};

const readAllTokens = <T>(
    current: T,
    parent: T | undefined,
    type: MermaidToken["type"],
    processors: MermaidProcessor<T>[],
    options?: MermaidRenderOptions<T>
): MermaidToken[] => {
    // Processor wrapper that injects the type to token
    const wrapper = (pr: MermaidProcessor<T>, cu?: T, pa?: T, op?: MermaidRenderOptions<T>) =>
        ({
            type,
            ...pr(cu, pa, op),
        } as MermaidToken);

    let tokens: MermaidToken[] = [];
    if (type === "graph" || type === "config") {
        tokens = processors.map((processor) => wrapper(processor, undefined, undefined, options));
    } else {
        const children = extractChildren(current, options);
        const childResults = children.map((child) => readAllTokens(child, current, type, processors, options));

        tokens = [...processors.map((processor) => wrapper(processor, current, parent, options)), ...childResults.flat()].filter(
            (token) => !!token && !!token.id
        );
    }

    return uniques(
        tokens.filter((token) => !!token && !!token.id),
        "id"
    ) as MermaidToken[];
};

export const mermaidRenderer = {
    create: <T>() => {
        let processors: Record<string, MermaidProcessor<T>[]> = {};
        const register = (type: MermaidToken["type"], processor: MermaidProcessor<T>) => {
            processors = {
                ...processors,
                [type!]: processors[type!] ? [...processors[type!], processor] : [processor],
            };
        };

        const render = (root: T, options?: MermaidRenderOptions<T>): string => {
            const delimeter = "```";
            let result = "";
            renderOrder.forEach((type) => {
                const tokens = readAllTokens<T>(root, undefined, type, processors[type!] || [], options);
                result += renderTokens(type, tokens);
            });
            return `${delimeter}mermaid\n${result}\n${delimeter}`;
        };

        return { register, render };
    },
};
