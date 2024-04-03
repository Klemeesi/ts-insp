import * as ts from "typescript";
import { InspOptions } from "../types";

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

const getImportPaths = (node: ts.Node, sourceFile: ts.SourceFile) => {
    let importPaths: string[] = [];
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (moduleSpecifier) {
            importPaths = [...importPaths, moduleSpecifier.getText(sourceFile)];
        }
    } else if (ts.isCallExpression(node)) {
        const text = node.getText(sourceFile);
        if ((text.includes("require") || text.includes("import")) && node.arguments.length > 0 && node.arguments[0]) {
            importPaths = [...importPaths, node.arguments[0].getText(sourceFile)];
        }
    }
    ts.forEachChild(node, (childNode: ts.Node) => {
        importPaths = [...importPaths, ...getImportPaths(childNode, sourceFile)];
    });
    return importPaths;
};

export const exportPlugin = (node: ts.Node, sourceFile: ts.SourceFile, key: string, options: InspOptions) => {
    const entry = [key + ":", ts.SyntaxKind[node.kind], getNameOfNode(node), ...getImportPaths(node, sourceFile)];
    console.log(...entry.filter((e) => !!e));
};
