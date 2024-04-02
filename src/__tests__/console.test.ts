import { consoleOutput } from "../output/console";
import { testDataSet1 } from "../__mocks__/mockData";

describe("traversal", () => {
    it("Basic console output test", () => {
        const result = consoleOutput(testDataSet1);
        expect(result).toMatchSnapshot();
    });
});
