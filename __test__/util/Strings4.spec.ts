import Strings from "../../src/util/Strings";
import { expect } from "chai";
describe("util/Strings4", () => {

    it("has", () => {
        expect(Strings.has("")).eq(false);
        expect(Strings.has(null)).eq(false);
        expect(Strings.has(undefined)).eq(false);
        expect(Strings.has("Example")).eq(true);
        for(let i = 0 ; i < 1000000; i++) {
            i++;
            expect(i).gt(0);
        }
    });

    it("startsWith", () => {
        expect(Strings.startsWith("Kamil", "Ka")).to.be.true;
        expect(Strings.startsWith("Kamil", "ka")).to.be.false;
        expect(Strings.startsWith("Kamil", null)).to.be.false;
        expect(Strings.startsWith("Kamil", undefined)).to.be.false;
    });

    it("endsWith", () => {
        expect(Strings.endsWith("Kamil", "il")).to.be.true;
        expect(Strings.endsWith("Kamil", "iL")).to.be.false;
        expect(Strings.endsWith("Kamil", null)).to.be.false;
        expect(Strings.endsWith("Kamil", undefined)).to.be.false;
    });
});
