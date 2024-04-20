# ts-insp

Tool for inspecting typescript project imports.

This is meant for documenting existing code and it's dependencies. Just something I needed IRL and couldn't find suitable solutions. Asked some pointers from ChatGPT and seemed like a cool thing to do. So here we are...

Currently only these file formats are supported but it all depends on what the typescript is able to parse:

-   .ts
-   .js
-   .tsx
-   .jsx
-   .d.ts

## Building the script

```
npm run build
```

## Running the script

```
npm run start test-data/test1.ts
```

## Example Output

![Image Alt Text](docs/DependencyTree.png)

## Configuration

Not possible at the moment.

## Future improvements

-   Configuration file
-   Option to discard the child imports if the dependant file has already been traversed. Otherwise there would be a lot of noice
-   Would be nice to convert relative imports to absolute ones. Just need the root folder
-   ~~Exporting to different formats (JSON, Image, HTML, PNG)~~
-   ~~Take tsconfig.json configuration in to account. aliases, rootDir, etc...~~
-   Export whole project (user gives the folder)
-   ~~Unit tests :)~~
-   More comprehensive unit tests :)
-   Make it runnable with npx. I don't think it works right now
-   Publish it
-   Maybe add more functionality for it. Check if there are unused dependencies in the package.json
