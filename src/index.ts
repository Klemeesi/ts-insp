import * as fs from "fs";
import { getImports } from "./helpers";
import { exportToConsole } from "./output";

const main = () => {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide a TypeScript file path as an argument.");
    return;
  }

  if (!fs.existsSync(filePath)) {
    console.error("File does not exist:", filePath);
    return;
  }

  const imports = getImports(filePath, 1);
  console.log();
  console.log("Imports:");
  exportToConsole(imports);
};

main();

/*
Imports:
 - fs
   └ fs
   └ fs
     └ fs
       └ fs
*/
