import path from "path";
import type { InspOptions } from "../types";
import * as ts from "typescript";
import fs from "fs";
import { getCompilerOptions, getPackageJson } from "./projectOptions";

export const getSettingsFromConfigFile = (filePath: string): Partial<InspOptions> => {
    const packageJson = getPackageJson(filePath);
    const compilerOptions = getCompilerOptions(filePath);
    const extension = filePath.split(".").pop();
    let contents = undefined;
    if (extension === "js" || extension === "mjs") {
        contents = require(path.resolve(filePath));
    } else if (extension === "ts" || extension === "mts") {
        const inputFilePath = path.resolve(process.cwd(), filePath);
        const postfix = Date.now();
        const outputFilePath = inputFilePath.replace(/\.ts$/, `_${postfix}.js`);

        const tsSrc = fs.readFileSync(inputFilePath, "utf-8");
        const transpiledResult = ts.transpileModule(tsSrc, {
            compilerOptions: compilerOptions?.options ?? {
                module: packageJson?.type === "module" ? ts.ModuleKind.ESNext : ts.ModuleKind.CommonJS,
            },
        });
        const output = transpiledResult.outputText;
        if (output) {
            try {
                fs.writeFileSync(outputFilePath, output);
                contents = require(outputFilePath);
                return contents.default;
            } catch (e) {
                console.log(e);
            } finally {
                fs.rmSync(outputFilePath);
            }
        }
    } else {
        console.log(`Unsupported config file extension: ${extension}`);
    }
    if (!contents) {
        console.log("Errors while reading configuration file.");
        process.exit(-1);
    }
    return contents;
};
