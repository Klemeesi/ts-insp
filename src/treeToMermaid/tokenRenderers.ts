import { groupBy } from "../helpers";
import { MermaidGraphToken, MermaidLinkToken, MermaidNodeToken, MermaidToken } from "./types";

export const renderOrder: MermaidToken["type"][] = ["config", "graph", "node", "link"];

const arrowTypes = {
    arrow: "-->",
    open: "---",
    dotted: "-.-",
    dottedArrow: "-.->",
    thick: "==>",
    invisible: "~~~",
};

const renderers = {
    graph: (tokens?: MermaidToken[]): string => {
        const graphTokens = tokens as MermaidGraphToken[];
        const graphToken = graphTokens?.length ? graphTokens[0] : undefined;
        return `graph ${graphToken?.dir || "LR"}`;
    },
    config: (tokens?: MermaidToken[]): string => {
        const configTokens = tokens as MermaidGraphToken[];
        const configToken = configTokens?.length ? configTokens[0] : undefined;
        if (configToken) {
            const layout = configToken.layout ? `  layout: ${configToken.layout}` : undefined;
            const theme = configToken.theme ? `  theme: ${configToken.theme}` : undefined;
            return ["---", "config:", layout, theme, "---"].filter((t) => !!t).join("\n");
        }
        return "";
    },
    node: (tokens?: MermaidToken[]): string => {
        const nodeTokens = tokens as MermaidNodeToken[] | [];
        const grouped = groupBy(nodeTokens, "groupName");
        const render = (nodeToken: MermaidNodeToken): string => {
            const id = nodeToken?.id;
            const name = nodeToken?.name ? `["${nodeToken?.name}"]` : undefined;
            const classDef = nodeToken?.classDef ? `:::${nodeToken?.classDef}` : undefined;
            return [nodeToken?.id, name, classDef].filter((t) => !!t).join("");
        };
        return Object.keys(grouped)
            .map((groupName) => {
                const groupTokens = grouped[groupName];
                if (groupName) {
                    return `subgraph ${groupName}\n${groupTokens.map(render).join("\n")}\nend`;
                }
                return groupTokens.map(render).join("\n");
            })
            .join("\n");
    },
    link: (tokens?: MermaidToken[]): string => {
        const linkTokens = tokens as MermaidLinkToken[] | [];
        const renderLink = ({ id, startId, endId, linkType }: MermaidLinkToken): string => {
            const arrowType = arrowTypes[linkType] || "-->";
            return id ? `${startId} ${id}@${arrowType} ${endId}` : `${startId} ${arrowType} ${endId} ${id}`;
        };
        return linkTokens.map(renderLink).join("\n");
    },
};

export const renderTokens = (type: MermaidToken["type"], tokens: MermaidToken[]) => {
    const renderer = renderers[type!];
    const relevantTokens = tokens.filter((token) => token.type === type);
    return `${renderer(relevantTokens)}\n`;
};
