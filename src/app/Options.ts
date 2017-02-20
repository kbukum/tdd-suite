import ArgsParser from "../util/ArgsParser";
import Constants from "../Constants";
import {resolve} from "path";
const packageJson = require("../../package.json");

const config = [
    ["-bu, --base-url <string>", "adapter path absoulte or relative", Constants.modulePath],
    ["-cp, --controller-path <string>", "controller path absoulte or relative"],
    ["-f, --framework <string>", "which tdd framework will use", "mocha"]
];

export interface OptionsProps {
    baseUrl: string,
    controllerPath: string,
    framework: string
}

export default class Options {
    static parse(args: string[]): OptionsProps {
        let props = {
            options: {}
        };
        let options = ArgsParser.parse(
            packageJson.name,
            packageJson.version,
            config,
            args,
            true
        );
        let {
            baseUrl,
            controllerPath,
            framework
        } = options;

        if (!controllerPath) {
            controllerPath = resolve(Constants.modulePath, Constants.adapterPath, framework);
        } else {
            controllerPath = resolve(baseUrl, controllerPath);
        }

        return {
            baseUrl,
            controllerPath,
            framework
        };
    }
}
