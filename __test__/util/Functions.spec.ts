import { getType, hasValue, requireEs6 } from "util/Functions"
import { expect } from "chai";
describe("util/Functions", () => {
    it("getType", () => {
        expect(getType("")).to.be.eq("String");
        expect(getType(true)).to.be.eq("Boolean");
        expect(getType(undefined)).to.be.eq("Undefined");
        expect(getType(null)).to.be.eq("Null");
        expect(getType(3)).to.be.eq("Number");
        expect(getType(new Date())).to.be.eq("Date");
    });

    it("hasValue", () => {
        expect(hasValue("")).to.be.true;
        expect(hasValue(3)).to.be.true;
        expect(hasValue(true)).to.be.true;
        expect(hasValue(null)).to.be.false;
        expect(hasValue(undefined)).to.be.false;
        expect(hasValue([])).to.be.true;
        expect(hasValue({})).to.be.true;
    });

    it("requireEs6", () => {
        let expected = {
            getType,
            hasValue,
            requireEs6
        };
        expect(requireEs6("util/Functions")).to.be.deep.eq(expected);
    });

});
