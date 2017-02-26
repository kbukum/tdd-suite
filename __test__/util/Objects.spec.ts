import Objects from "util/Objects";
import Types from "util/Types";
import { expect } from "chai";

describe("util/Objects", () => {
    it("isEmptyOrNull", () => {
        expect(Objects.has({})).to.be.true;
        expect(Objects.has({ a: "5"})).to.be.false;
        expect(Objects.has(null)).to.be.true;
        expect(Objects.has(null)).to.be.true;
    });

    it("hasProperty", () => {
        expect(Objects.hasProperty({}, "a")).to.be.false;
        expect(Objects.hasProperty({ a: "5"}, "a")).to.be.true;
    });

    it("map", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7]
        };
        let expectedArray = ["String", "Number", "Array"];
        let array: any[] = Objects.map(object, (item) => {
            return Types.getName(item);
        });
        expect(array).to.deep.eq(expectedArray);
    });

    it("forEach", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7]
        };
        let expectedArray = ["String", "Number", "Array"];
        let array: any[] = [];
        Objects.forEach(object, (item) => {
            array.push(Types.getName(item));
        });
        expect(array).to.deep.eq(expectedArray);
    });

    it("getLength", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7]
        };
        expect(Objects.getLength(object)).to.deep.eq(3);
    });

    it("getKeys", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7]
        };
        expect(Objects.getKeys(object)).to.deep.eq(["a", "b", "c"]);
    });

    it("addValue", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7]
        };
        Objects.addValue(object, "d", "new element");
        let expected: any = {
            a: "4",
            b: 5,
            c: [6, 7],
            d: "new element"
        };
        expect(object).to.deep.eq(expected);
        let keys = ["f", "g"];
        Objects.addValue(object, "e", "Example", keys);
        expected = {
            a: "4",
            b: 5,
            c: [6, 7],
            d: "new element",
            e: {
                f: {
                    g: "Example"
                }
            }
        };
        expect(object).to.deep.eq(expected);
    });

    it("getValue", () => {
        let object = {
            a: "4",
            b: 5,
            c: [6, 7],
            d: "new element",
            e: {
                f: {
                    g: "Example"
                }
            }
        };
        expect(Objects.getValue(object, "e", ["f", "g"])).to.deep.eq("Example");
    });

    it("clone", () => {
        let obj = {};
        let objectClone = Objects.clone(obj, []);
        expect(obj).to.deep.eq(objectClone);
    });

    it("merge", () => {
        let obj = {
            a:5,
            c: {
                d: "4"
            },
            b: "Deneme"
        };

        let obj2 = {
            b: "Deneme",
            c: {
                e: ["Example", "Ex"]
            },
            d: "Deneme"
        };
        let mergedObject = Objects.merge(obj, obj2);

        let expectedObj = {
            a:5,
            c: {
              d: "4",
              e: ["Example", "Ex"]
            },
            b: "Deneme",
            d: "Deneme"
        };
        expect(mergedObject).to.deep.eq(expectedObj);
    });

    it("mergeDefaults", () => {
        let defaults = {
            a:5,
            c: {
                d: "4",
                e: ["Default"]
            },
            b: "defaultDeneme"
        };

        let obj2 = {
            b: "obj2 deneme",
            c: {
                e: ["Example", "Ex"]
            },
            d: "Deneme"
        };
        let mergedObject = Objects.mergeDefaults(defaults, obj2);

        let expectedObj = {
            a:5,
            c: {
                d: "4",
                e: ["Example", "Ex"]
            },
            b: "obj2 deneme",
            d: "Deneme"
        };
        expect(mergedObject).to.deep.eq(expectedObj);
    });
});