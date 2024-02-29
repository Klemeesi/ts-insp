import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";

const getTsConfigFilePath = (initialFilePath: string) => {
  let currentDir = path.dirname(initialFilePath);
  while (currentDir !== "/") {
    const tsConfigFilePath = path.join(currentDir, "tsconfig.json");
    if (fs.existsSync(tsConfigFilePath)) {
      return { tsConfigFilePath, tsConfigPath: currentDir };
    }
    currentDir = path.dirname(currentDir);
  }
  return {};
};

export const getCompilerOptions = (initialFilePath: string) => {
  const { tsConfigFilePath, tsConfigPath } =
    getTsConfigFilePath(initialFilePath);
  if (!tsConfigFilePath) {
    return undefined;
  }

  const configFileContent = fs.readFileSync(tsConfigFilePath, "utf-8");
  const parsedConfig = ts.parseConfigFileTextToJson(
    tsConfigFilePath,
    configFileContent
  );

  if (parsedConfig.error) {
    console.error(
      "Error parsing tsconfig.json:",
      parsedConfig.error.messageText
    );
    return;
  }

  const config = ts.parseJsonConfigFileContent(
    parsedConfig.config,
    ts.sys,
    path.dirname(tsConfigFilePath)
  );
  return {
    tsConfigFilePath,
    tsConfigPath,
    options: config.options,
  };
};
