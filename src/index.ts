import { getImports } from "./traversal";
import { consoleOutput } from "./output/console";
import { getConfig } from "./commandLine";

const main = () => {
  const config = getConfig();

  const imports = [
    {
      import: config.file,
      resolved: true,
      level: 0,
      imports: getImports(config.file, 1),
    },
  ];
  console.log();

  consoleOutput(imports).forEach((line) => console.log(line));
};

main();
