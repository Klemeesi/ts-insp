export interface ImportInfo {
  import: string;
  resolved: boolean;
  absolutePath?: string;
  level: number;
  imports: ImportInfo[];
}
