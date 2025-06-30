# ts-insp

Console tool for inspecting typescript project imports.

This is meant for documenting existing code and it's dependencies. Just something I needed IRL and couldn't find suitable solutions. Asked some pointers from ChatGPT and seemed like a cool thing to do. So here we are...

The tool itself traverses a dependency tree starting from a single typescript or javascript file. It visualizes the dependency tree in some format. Currently output options are very limited. Current options:

-   _Console output_ - Just printing the dependencies to console. Simple
-   _JSON_ - Export to JSON file. If you just want to log the dependencies in JSON for future use, it is possible
-   _mermaid_ - Markdown file with mermaid chart. _SVG_ and _PNG_ versions of the chart can also be generated with mermaid-cli.

## Examples

An visualisations (ts-insp is run against this github repository)

### Dependency Graph as svg

![Dependency Graph of ts-insp tool](https://raw.githubusercontent.com/Klemeesi/ts-insp/main/docs/MermaidExample-1.svg)

### Dependency Graph as png

![Dependency Graph of ts-insp tool](https://raw.githubusercontent.com/Klemeesi/ts-insp/main/docs/MermaidExample-1.png)

### Dependency Tree as json

[Dependency Tree of ts-insp tool as JSON](https://raw.githubusercontent.com/Klemeesi/ts-insp/main/docs/JsonExample.json)

### Dependency Graph as mermaid markdown

[Dependency Graph of ts-insp tool as raw mermaid markdown](https://raw.githubusercontent.com/Klemeesi/ts-insp/main/docs/MermaidExample.md)
[Dependency Graph of ts-insp tool](docs/MermaidExample.md)

## Installing and running

### yarn

Install the dev dependency

```sh
yarn add -D ts-insp
```

Run the script

```sh
yarn ts-insp --help
```

### npx

You can run the tool without installing dependency:

```sh
npx ts-insp --help
```

## Configuration

Create configuration file e.g. `./ts-insp.config.ts` (javascript is possible too if you prefer the older brother more). All options are supported in the configuration file.

Example:

```ts
import type { InspOptions } from "./dist/types.d.ts";
import { consoleOutputPlugin } from "./dist/output/console";
import { jsonOutputPlugin } from "./dist/output/json";
import { mermaidOutputPlugin } from "./dist/output/mermaid";

const config: Partial<InspOptions> = {
    // Debug logs
    verbose: false,
    // Supported types. js, ts, jsx, tsx ja d.ts files are officially supported. Some other typescript
    // friendly files might be too.
    supportedTypes: ["tsx", "ts", "d.ts"],
    // Entry point where traversing starts
    file: "App.tsx",
    // By default node modules are not traversed. Can be enabled but feature is experimental
    traverseNodeModules: false,
    // By default retraversing is disabled. This defines whether same module is processed again when
    // encountered during traversing. If the amount of iterations for traversing is too high
    // circular dependencies will be a problem. Use with caution.
    retraverse: false,
    // Skip imports that import only types. Not skipped by default.
    skipTypeImports: false,
    // Filter modules from results. Everything shown by default.
    filterModules: (node, parent) => true,
    // html and png formatting options. More information later
    format: {
        consoleOutputPlugin(),
        jsonOutputPlugin({
            outputPath: "docs",
            outputName: "JsonExample",
        }),
        mermaidOutputPlugin({
            outputPath: "docs",
            dir: "LR",
            outputName: "MermaidExample",
            // Options: tree, graph
            chartType: "graph",
            // Rendering policies
            policies: {
                // How grouping to subgraphs is done. Options: "none", "default", or a function that returns a string or undefined
                subgraph: "default",
                // How node names are generated. Options: "default" or a function that returns a string
                nodeName: "default",
            },
            // Options that are used if you want to export
            cliOptions: {
                mmdcPathToken: "{mmdc}",
                inputPathToken: "{inputPath}",
                commands: ["{mmdc} -i {inputPath} -o docs\\MermaidExample.svg", "{mmdc} -i {inputPath} -o docs\\MermaidExample.png"],
            },
        }),
    }
};

export default config;
```

After the configuration file has been created you can run the tool with following command:

```sh
yarn ts-insp -c ts-insp.config.ts
```

Command line configuration instructions can be read with following command. Command line options will overwrite the configuration file options if provided.

```sh
yarn ts-insp --help
```

## Future improvements

Some features will come in the future. But first the project needs to be improved to be more maintainable:

-   More unit tests
-   Traversing should be streamlined
-   More premade features for Mermaid charts
