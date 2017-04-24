import Helper from "command-helper";
import { Objects, has } from "wasabi-common";
import {TemplateProps} from "command-helper/lib/api/Template";
import Constants from "../Constants";
import {resolve} from "path";
const packageJson = require("../../package.json");
const opts = require("./Template.json");

let template: TemplateProps =  {
    name: packageJson.name,
    version: packageJson.version,
    ...opts
};

(template as any).options.baseUrl.defaultValue = Constants.baseUrl;
(template as any).options.framework.defaultValue = Constants.framework;

const helper = new Helper(template);

export interface OptionsProps {
    renderer?: boolean
    interactive?: boolean
    tddConfig?: {
        [key: string]: any
    }
    rootDirs?: string[]
    baseUrl?: string
    controllerPath?: string
    framework?: string
    indexUrl?: string
}

export default class Options {

    /**
     * Provides to parse args
     * @param args
     * @return {OptionsProps}
     */
    public static parse(args: string[]): OptionsProps {
        let template = helper.parse(args);
        let options: OptionsProps = template.options;
        if(has(options.tddConfig)) {
            let tddConfig = options.tddConfig;
            delete options.tddConfig;
            Objects.forEach(template.defaults, (value, key) => {
                if(has(tddConfig[key])) {
                    options[key] = tddConfig[key];
                }
            });
        }
        return options;
    }
}