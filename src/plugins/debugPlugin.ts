import * as ts from "typescript";
import type { MainOptions } from "../types";
import { getImportsFromNode } from "../helpers/importParser";

const getNameOfNode = (node: ts.Node) => {
    if (
        ts.isVariableDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isClassDeclaration(node) ||
        ts.isEnumDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node)
    ) {
        return node.name?.getText();
    }
    return undefined;
};

export const exportPlugin = (node: ts.Node, sourceFile: ts.SourceFile, key: string, options: MainOptions) => {
    const imports = getImportsFromNode(options, key, node, sourceFile).map((i) => i.absolutePath);
    const entry = [key + ":", ts.SyntaxKind[node.kind], getNameOfNode(node), ...imports];
    console.log(...entry.filter((e) => !!e));
};
