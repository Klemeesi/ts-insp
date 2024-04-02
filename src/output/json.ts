import { ImportInfo } from "../types";
import * as fs from "fs";

export const generateJson = (imports: ImportInfo[]) => {
    fs.writeFileSync("exports/output.json", JSON.stringify(imports, undefined, 2));
};
