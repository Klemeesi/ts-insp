import * as ts from "typescript";
import { MainOptions } from "../types";
import { getCommentsFromFile } from "../helpers/commentParser";

export const docPlugin = (node: ts.Node, sourceFile: ts.SourceFile, key: string, options: MainOptions) => {
    const comments = getCommentsFromFile(sourceFile);
    if (comments) {
        console.log(comments);
    }
};
