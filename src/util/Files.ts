import * as fs from "fs";
import Strings from "./Strings";
/**
 * A static class which implements mostly used files operations.
 *
 * @class Strings
 */
export default class Files {
    /**
     *
     * @param path
     * @return {boolean}
     */
    public static has(filePath: string): boolean {
        return Strings.has(filePath) && fs.existsSync(filePath);
    }

    /**
     *
     * @param filePath
     * @param assertion
     * @param encoding
     * @return {any}
     */
    public static readJsonSync(filePath: string, assertion?: boolean, encoding?: string): any {
        if(Files.has(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, encoding || 'utf8'));
        }
        return null;
    }
}


