import type { ImportInfo, MermaidFormatOptions } from "../types";
import * as fs from "fs";
import path from "path";

const defaultOptions = {
    dir: "TB",
    nodeId: "id",
    outputPath: "exports",
    outputName: "export",
};

const encodeText = (text: string) => text.replace("@", "#64;");
const encodeId = (id: string) => id.replace("@", "_");

const getNodeGenerator = (opt: MermaidFormatOptions) => (i: ImportInfo) => ({
    id: encodeId((i[opt.nodeId!] as string) || i.uniqueId),
    name: encodeText(i.moduleName),
    link: i.type === "Source file" ? "==>" : i.type === "Node module" ? "-->" : "-.-",
});

const returnMermaidLinks = (root: ImportInfo, getInfo: ReturnType<typeof getNodeGenerator>) => {
    const src = getInfo(root);
    let lines: string[] = [];
    root.imports.forEach((dest) => {
        const dst = getInfo(dest);
        lines = [...lines, `${src.id}[${src.name}] ${dst.link} ${dst.id}[${dst.name}]`, ...returnMermaidLinks(dest, getInfo)];
    });
    return lines;
};

export const mermaidOutputPlugin = (options: MermaidFormatOptions) => async (imports: ImportInfo[]) => {
    const opt = { ...defaultOptions, ...(options || {}) };
    const output = path.resolve(opt.outputPath, `${opt.outputName}.md`);

    let lines: string[] = [];
    imports.forEach((root) => {
        lines = [...lines, ...returnMermaidLinks(root, getNodeGenerator(options))];
    });
    const content = ["```mermaid", `graph ${opt.dir}`, ...lines, "```"].join("\n");

    fs.writeFileSync(output, content);
    console.log("Saved", output);
};
