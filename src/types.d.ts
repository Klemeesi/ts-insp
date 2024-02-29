export interface ImportInfo {
  import: string;
  resolved: boolean;
  absolutePath?: string;
  level: number;
  imports: ImportInfo[];
}

export interface InspOptions {
  verbose: boolean;
  configFile: string;
  supportedTypes: string[];
  iterations: number;
  file: string;
}
