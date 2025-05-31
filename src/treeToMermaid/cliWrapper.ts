import { MermaidCliOptions } from "../types";
import { exec } from "child_process";
import * as path from "path";

export const runMermaidCli = async (opt: MermaidCliOptions, input: string) => {
    const mmdcPath = path.resolve("./node_modules/.bin/mmdc");
    const cmds = opt.commands || [];
    for (const cmd of cmds) {
        const command = cmd.replace(opt.mmdcPathToken || "{mmdcPath}", mmdcPath).replace(opt.inputPathToken || "{inputPath}", input);
        console.log("Running command:", command);
        await exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                return;
            }
        });
    }
};
