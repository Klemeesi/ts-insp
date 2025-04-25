import type { ImportInfo, MermaidFormatOptions } from "../types";
import * as fs from "fs";
import path from "path";
import { mermaidRenderer } from "../treeToMermaid/renderer";
import { getDefaultProcessors } from "../treeToMermaid/defaultProcessors";
import { MermaidToken } from "../treeToMermaid/types";
import { runMermaidCli } from "../treeToMermaid/cliWrapper";

const defaultOptions: MermaidFormatOptions = {
    dir: "LR",
    outputPath: "exports",
    outputName: "export",
    chartType: "graph",
    extractGroupName: (node: ImportInfo) => {
        const ap = node.absolutePath || "";
        if (ap.startsWith("node_modules") || node.type === "Unknown") {
            return "node_modules";
        } else {
            const splitted = ap.split("/");
            return splitted[splitted.length - 2] || undefined;
        }
    },
};

export const mermaidOutputPlugin = (options: MermaidFormatOptions) => async (imports: ImportInfo[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath!, `${opt.outputName}.md`);

    const processor = mermaidRenderer.create<ImportInfo>();
    const defaultProcessors = getDefaultProcessors(opt);
    Object.keys(defaultProcessors).forEach((key) => {
        const name = key as keyof MermaidToken["type"];
        processor.register(name, defaultProcessors[key]);
    });

    const result = processor.render(imports[0], {
        extractChildren: (i) => i.imports,
    });
    fs.writeFileSync(output, result, "utf8");

    if (opt.cliOptions) {
        await runMermaidCli(opt.cliOptions, output);
    }
};
