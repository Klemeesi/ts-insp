export const testDataSet1 = [
    {
        absolutePath: "src/traversal.ts",
        import: "src/traversal.ts",
        imports: [
            {
                absolutePath: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                import: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                imports: [],
                level: 2,
                resolved: true,
            },
            {
                import: "path",
                imports: [],
                level: 2,
                resolved: false,
            },
            {
                import: "fs",
                imports: [],
                level: 2,
                resolved: false,
            },
            {
                absolutePath: "src/types.d.ts",
                import: "src/types.d.ts",
                imports: [
                    {
                        absolutePath: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                        import: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                        imports: [],
                        level: 3,
                        resolved: true,
                    },
                ],
                level: 2,
                resolved: true,
            },
            {
                absolutePath: "src/output/log.ts",
                import: "src/output/log.ts",
                imports: [],
                level: 2,
                resolved: true,
            },
        ],
        level: 1,
        resolved: true,
    },
    {
        absolutePath: "src/tsConfig.ts",
        import: "src/tsConfig.ts",
        imports: [
            {
                absolutePath: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                import: "C:/Source/ts-insp/node_modules/typescript/lib/typescript.d.ts",
                imports: [],
                level: 2,
                resolved: true,
            },
            {
                import: "fs",
                imports: [],
                level: 2,
                resolved: false,
            },
            {
                import: "path",
                imports: [],
                level: 2,
                resolved: false,
            },
        ],
        level: 1,
        resolved: true,
    },
];
