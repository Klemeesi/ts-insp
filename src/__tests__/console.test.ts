import { consoleOutput } from "../output/console";
import { testDataSet1 } from "../__mocks__/mockData";

describe("console", () => {
    it("Basic console output test", () => {
        const result = consoleOutput(testDataSet1);
        expect(result).toMatchSnapshot();
    });
});
