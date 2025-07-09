import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const getConfigFilePath = (initialFilePath: string, fileName: string) => {
    let currentDir = path.dirname(initialFilePath);
    while (currentDir !== "/") {
        const configFilePath = path.join(currentDir, fileName);
        if (fs.existsSync(configFilePath)) {
            return { configFilePath, configPath: currentDir };
        }
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) {
            // Reached the root directory without finding the config file
            break;
        }
        currentDir = parentDir;
    }
    return {};
};

export const getCompilerOptions = (initialFilePath: string) => {
    const { configFilePath, configPath } = getConfigFilePath(path.resolve(initialFilePath), "tsconfig.json");
    if (!configFilePath) {
        return undefined;
    }

    const configFileContent = fs.readFileSync(configFilePath, "utf-8");
    const parsedConfig = ts.parseConfigFileTextToJson(configFilePath, configFileContent);

    if (parsedConfig.error) {
        console.error("Error parsing tsconfig.json:", parsedConfig.error.messageText);
        return;
    }

    const config = ts.parseJsonConfigFileContent(parsedConfig.config, ts.sys, path.dirname(configFilePath));
    return {
        tsConfigFilePath: configFilePath,
        tsConfigPath: configPath,
        options: config.options,
    };
};

export const getPackageJson = (initialFilePath: string) => {
    const { configFilePath } = getConfigFilePath(path.resolve(initialFilePath), "package.json");

    if (!configFilePath) {
        return undefined;
    }

    const packageJsonContent = fs.readFileSync(configFilePath, "utf-8");
    try {
        return JSON.parse(packageJsonContent);
    } catch (error) {
        console.error("Error parsing package.json:", error);
        return undefined;
    }
};
