import { ImportInfo, MermaidFormatOptions } from "../types";
import { MermaidProcessor, MermaidToken } from "./types";

export const getDefaultProcessors = (opt: MermaidFormatOptions): Record<string, MermaidProcessor<ImportInfo>> => {
    if (opt.chartType === "tree") {
        return {
            graph: () => ({
                id: "idk",
                dir: opt.dir,
            }),
            node: (current?: ImportInfo) => ({
                id: current?.uniqueId!,
                name: current?.moduleName,
            }),
            link: (current?: ImportInfo, parent?: ImportInfo) => {
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
        node: (current?: ImportInfo) => {
            if (!current) {
                return undefined;
            }
            return {
                id: current.id!,
                name: current.moduleName,
                groupName: opt.extractGroupName ? opt.extractGroupName(current) : undefined,
            };
        },
        link: (current?: ImportInfo, parent?: ImportInfo) => {
            if (!current || !parent) {
                return undefined;
            }
            const startGroup = opt.extractGroupName ? opt.extractGroupName(parent) : undefined;
            const endGroup = opt.extractGroupName ? opt.extractGroupName(current) : undefined;
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
