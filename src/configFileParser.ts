import path from "path";
import { InspOptions } from "./types";

// Supports only javascript files
export const getSettingsFromConfigFile = (filePath: string): Partial<InspOptions> => {
    const contents = require(path.resolve(filePath));
    // TODO: plugins need to be already converted to correct format. Strings are not allowed
    return contents;
};
