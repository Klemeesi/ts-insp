import type { ResultTreeNode, MermaidFormatOptions } from "../types";
import * as fs from "fs";
import path from "path";
import { mermaidRenderer } from "../treeToMermaid/renderer";
import { getDefaultProcessors } from "../treeToMermaid/defaultProcessors";
import { MermaidToken } from "../treeToMermaid/types";
import { runMermaidCli } from "../treeToMermaid/cliWrapper";
import { getMermaidGroupNamePolicy, getMermaidLinkPolicy, getMermaidNodeNamePolicy } from "./mermaidPolicies";

const defaultOptions: MermaidFormatOptions = {
    dir: "LR",
    outputPath: "exports",
    outputName: "export",
    chartType: "graph",
};

export const mermaidOutputPlugin = (options: MermaidFormatOptions) => async (imports: ResultTreeNode[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath!, `${opt.outputName}.md`);

    opt.policies = {
        subgraph: getMermaidGroupNamePolicy(opt.policies?.subgraph),
        nodeName: getMermaidNodeNamePolicy(opt.policies?.nodeName),
        link: getMermaidLinkPolicy(opt),
    };

    const processor = mermaidRenderer.create<ResultTreeNode>();
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
