export type TreeNode<TChild, KChildren extends string = "children", ExtraProps extends object = {}> = {
    [P in KChildren]: TChild[];
} & ExtraProps;

export interface MermaidToken {
    id: string;
    type?: "graph" | "config" | "node" | "link";
}

export interface MermaidGraphToken extends MermaidToken {
    dir: "LR" | "TB" | "RL" | "BT";
}

export interface MermaidGraphToken extends MermaidToken {
    theme?: "default" | "forest" | "dark" | "neutral" | "base" | "defaultDark";
    layout?: "elk" | "dagre";
}

export interface MermaidNodeToken extends MermaidToken {
    name?: string;
    groupName?: string;
    classDef?: string;
}

export interface MermaidLinkToken extends MermaidToken {
    startId: string;
    endId: string;
    linkType: "arrow" | "open" | "dotted" | "dottedArrow" | "thick" | "invisible";
}

export interface MermaidClassDefToken extends MermaidToken {
    fill: string;
    fillOpacity: number;
    stroke: string;
    strokeWidth: string;
    strokeDasharray: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    textAlign: string;
    background: string;
    padding: string;
    rx: number;
    ry: number;
    fontFamily: string;
}

export interface MermaidRenderOptions<T> {
    extractChildren?: (node: T) => T[] | undefined;
}

export type MermaidProcessor<T> = (current?: T, parent?: T, options?: MermaidRenderOptions<T>) => MermaidToken | undefined;
