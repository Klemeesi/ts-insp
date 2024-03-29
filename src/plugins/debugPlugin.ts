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

export const exportPlugin = (
  node: ts.Node,
  key: string,
  options: InspOptions
) => {
  const entry: string[] = [key + ":", ts.SyntaxKind[node.kind]];
  const name = getNameOfNode(node);
  if (name) {
    entry.push(name);
  } else if (ts.isImportDeclaration(node)) {
    entry.push(node.moduleSpecifier?.getText());
  }

  console.log(...entry);
};
