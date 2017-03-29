import Options from "app/Options";

describe("app/Options", () => {
    it("parse", () => {
        let result = Options.parse([]);
        console.log(result);
    });
});
