import { ImportInfoV2 } from "../types";
import * as fs from "fs";

export const generateJson = (imports: ImportInfoV2[]) => {
    fs.writeFileSync("exports/output.json", JSON.stringify(imports, undefined, 2));
};
