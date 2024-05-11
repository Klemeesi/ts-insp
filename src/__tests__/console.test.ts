import { consoleOutputPlugin } from "../output/console";
import { testDataSet1 } from "../__mocks__/mockData";

describe("console", () => {
    it("Basic console output test", () => {
        let result: string[] = [];
        const originalConsoleLog = console.log;
        try {
            console.log = (...args) => {
                result = [...result, ...args];
            };
            consoleOutputPlugin()(testDataSet1);
        } catch (e) {
            throw e;
        } finally {
            console.log = originalConsoleLog;
        }

        expect(result).toMatchSnapshot();
    });
});
