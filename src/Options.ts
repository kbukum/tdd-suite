const packageJson = require("../package.json");
const { resolve } = require("path");
import {requireEs6, hasValue} from "./util/Functions";
import Strings from "./util/Strings";
import Constants from "./Constants";
import CommandHelpers, { AdditionalProps } from "./util/CommandHelper";

export interface OptionsProps {
    options: {
        [key: string]: any
    },
    additional: AdditionalProps
}

export default class Options {
    static parse(args: string[]) {
        let helpers = new CommandHelpers({
            name: packageJson.name,
            version: packageJson.version,
            allowUnknownOption: true,
            removeFromArgv: true,
            configFile: "tddConfig",
            onHelp: Options.onHelp,
            template: Constants.commandTemplate
        });

        let opts = helpers.parse(process.argv);

        if(opts.options.interactive) {
            opts.options.rendered = true;
        }

        if(!hasValue(opts.options.baseUrl)) {
            opts.options.baseUrl = process.cwd();
        }

        let adapterPathKey = opts.additional.mapArgs["adapterPath"];
        let adapterIsDefault = opts.additional.defaultArgs[adapterPathKey];

        if(opts.options.renderer) {
            let indexUrlKey = opts.additional.mapArgs["indexUrl"];
            let indexIsDefault = opts.additional.defaultArgs[indexUrlKey];
            if(!indexIsDefault) {
                if(!adapterIsDefault) {
                    opts.options.indexUrl = resolve(opts.options.baseUrl, opts.options.adapterPath, opts.options.indexUrl);
                } else {
                    opts.options.indexUrl = resolve(opts.options.baseUrl, opts.options.indexUrl);
                }
            }
        }
        let adapterClassKey = opts.additional.mapArgs["adapterClass"];
        let adapterClassIsDefault = opts.additional.defaultArgs[adapterClassKey];
        if(!adapterClassIsDefault) {
            if(!adapterIsDefault) {
                opts.options.adapterClass = resolve(opts.options.baseUrl, opts.options.adapterPath, opts.options.adapterClass);
            } else {
                opts.options.adapterClass = resolve(opts.options.baseUrl, opts.options.adapterClass);
            }
        }
        let tddRunner = opts.additional.mapArgs["tddRunner"];
        if(!hasValue(opts.options.tddRunner)) {
            opts.options.tddRunner = resolve(Constants.adapterPath, opts.options.framework, Constants.runner);
        } else {
            if(!adapterIsDefault) {
                opts.options.tddRunner = resolve(opts.options.baseUrl, opts.options.adapterPath, opts.options.tddRunner);
            } else {
                opts.options.tddRunner = resolve(opts.options.baseUrl, opts.options.tddRunner);
            }
        }

        let rootList = opts.options.rootList;
        for(let i = 0 ; i < rootList.length; i++) {
            rootList[i] = resolve(opts.options.baseUrl, rootList[i]);
        }
        return opts;
    }

    static onHelp (command, commandOption, i, options, argv, flags) {
        i++;
        if(argv.length <= (i)) return;
        let framework = argv[i];
        if(!Strings.has(framework)) return;
        const adapterPath = resolve(Constants.tddModulePath, Constants.commandTemplate["--adapter-class"][2], framework);
        try{
            const AdapterClass = requireEs6(adapterPath);
            if(AdapterClass && AdapterClass.help) {
                AdapterClass.help();
            }
        }catch (e) {

        }
    };

}