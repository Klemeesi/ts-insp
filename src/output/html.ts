import * as fs from "fs";
import { ImportInfo } from "../types";

export const generateHtmlPage = (
  importInfos: ImportInfo[],
  template: string
): void => {
  const htmlContent = generateHtmlContent(importInfos, template);
  fs.writeFileSync("foo.html", htmlContent);
};

const generateHtmlContent = (
  importInfos: ImportInfo[],
  templatePath: string
): string => {
  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const importTree = generateImportTree(importInfos);
  return templateContent.replace("{{importTree}}", importTree);
};

const generateImportTree = (importInfos: ImportInfo[]): string => {
  let html = "";
  importInfos.forEach((importInfo) => {
    html += `<li class="import${importInfo.import ? "" : " empty"}">
            <span class="toggle${importInfo.imports.length ? " open" : ""}">${
      importInfo.import
    }</span>
            ${
              importInfo.imports.length
                ? `
                <ul class="children">
                    ${generateImportTree(importInfo.imports)}
                </ul>
            `
                : ""
            }
        </li>`;
  });
  return html;
};

// Example usage
const imports: ImportInfo[] = [
  {
    import: "module1",
    resolved: true,
    level: 0,
    imports: [
      {
        import: "module2",
        resolved: true,
        level: 1,
        imports: [],
      },
      {
        import: "module3",
        resolved: true,
        level: 1,
        imports: [],
      },
    ],
  },
  {
    import: "module4",
    resolved: true,
    level: 0,
    imports: [
      {
        import: "module5",
        resolved: true,
        level: 1,
        imports: [],
      },
    ],
  },
];
