import Options from "app/Options";
const tddConfig = require("../../tdd.json");
import { expect } from "chai";

describe("app/Options", () => {
    it("parse", () => {
        let result = Options.parse(
            [
                "./bin/tdd-suite",
                "--tdd-config",
                "tdd.json",
                "--opts mocha.opts"
            ]
        );
        for(let key in tddConfig) {
            if(tddConfig.hasOwnProperty(key)) {
                expect(result[key]).to.be.deep.eq(tddConfig[key])
            }
        }
    });
});
