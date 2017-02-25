import Class from "../lang/Class";
import Strings from "./Strings";
import {hasValue} from "./Functions";
import Objects from "./Objects";
import Arrays from "./Arrays";
import {resolve} from "path";
const fs = require("fs");

export interface Result {
    removes: number[],
    skipStep?: number
}
export interface GetterFunction {
    (command, commandOption?, i?, options?, argv?, flags?): Result | any
}
export interface IGetter {
    [key: string]: GetterFunction
}


export interface AdditionalProps {
    rawArgs: string[],
    defaultArgs: {
        [key:string]: boolean
    }
    mapArgs: {
        [key:string]: string
    },
    otherArgs: string[]
}

export interface ParseResult {
    options: any,
    additional: AdditionalProps
}

export interface CommandHelperProps {
    name: string,
    version: string,
    allowUnknownOption: boolean,
    configFile: string,
    removeFromArgv?: boolean,
    onHelp?: GetterFunction,
    template: {
        [key: string]: any[] | string
    }
    getters?: {
        [key: string]: IGetter | string
    }
}

export default class CommandHelper extends Class {
    props;
    static defaultGetters: IGetter = {
        Boolean: CommandHelper.Boolean,
        String: CommandHelper.String,
        Array: CommandHelper.Array
    };

    constructor(props: CommandHelperProps) {
        super();
        this.props = props;
        this.props.getters = Objects.merge(this.props.getters, CommandHelper.defaultGetters);
        if (!this.props.getters.help) {
            this.props.getters.help = this.help;
        }
    }

    parse(argv): ParseResult {
        let additional: AdditionalProps = {
            rawArgs: argv.slice(0),
            mapArgs: {},
            defaultArgs: {},
            otherArgs: []
        };
        let options: any = {};
        for (let i = 0; i < argv.length; i++) {
            let arg = argv[i];
            let result = undefined;
            try {
                if (!Strings.startsWith(arg, "-")) continue;
                // its not command.

                let parts = arg.split("="); // split parameters because of parameter=someting
                let command = parts[0]; //
                if (!hasValue(command) || command === "") { // if arg == "" then pass it
                    continue;
                }
                // get template of command.
                let commandOption = this.props.template[command];
                if (!hasValue(commandOption)) continue;

                if (typeof commandOption === "string") { // it is alias
                    let cmdOption = this.getTemplateByAlias(command, commandOption);
                    command = commandOption;
                    commandOption = cmdOption;
                }

                if (hasValue(options[command])) continue;
                if (commandOption.length === 0) continue;
                let fn = null;
                if (commandOption.length === 0) continue;

                switch (typeof commandOption[0]) {
                    case "function":
                        fn = commandOption[0];
                        break;
                    case "string":
                        fn = this.props.getters[commandOption[0]];
                        break;
                    default:
                        throw new Error(`Unkown type of ${commandOption[0]}`);

                }

                result = fn(command, commandOption, i, options, argv, parts);
                if (!hasValue(result)) continue;
                if (result.skipStep && result.skipStep >= i) i = result.skipStep;
                if (this.props.removeFromArgv && result.removes && result.removes.length > 0) {
                    result.removes.forEach((index) => {
                        argv[index] = undefined
                    });
                }
            } finally {
                if (!hasValue(result)) {
                    additional.otherArgs.push(arg)
                }
            }
        }
        if (this.props.removeFromArgv) {
            Arrays.cleanValueFromArray(argv, undefined);
        }
        for (let key in this.props.template) {
            if (Objects.hasProperty(this.props.template, key) && !hasValue(options[key])) {
                let templateOption = this.props.template[key];
                if (typeof templateOption !== "string" && templateOption.length > 2) {
                    additional.defaultArgs[key] = true;
                    options[key] = templateOption[2];
                }
            }
        }
        for (let key in options) {
            if (Objects.hasProperty(options, key)) {
                let newKey = CommandHelper.convertKey(key);
                if (newKey != key) {
                    options[newKey] = options[key];
                    delete options[key];
                    additional.mapArgs[newKey] = key;
                }
            }
        }
        let result = {
            options,
            additional
        };
        return result;
    }

    private static convertKey(key) {
        if (Strings.startsWith(key, "-")) {
            key = key.substring(1);
            if (Strings.startsWith(key, "-")) {
                key = key.substring(1);
            }
        }
        let keys = key.split("-");
        if (keys.length > 1) {
            for (let i = 1; i < keys.length; i++) {
                keys[i] = Strings.capitalizeFirstLetter(keys[i]);
            }
            key = keys.join("");
        }
        return key;
    }

    private getTemplateByAlias(command, commandOption) {
        let cmdOption = this.props.template[commandOption];
        if (hasValue(cmdOption)) {
            throw new Error(`defined alias '${command}:${commandOption}'  not found in ${this.props.template}`);
        }
        return cmdOption;
    }

    help(command, commandOption, i, options, argv, flags) {
        let template = this.props.template;
        let lTemp = {};
        let maxLengthFirst = 0;
        for (let key in template) {
            if (!Objects.hasProperty(template, key)) continue;
            let tmpO = template[key];
            let tempKey = key;
            if (typeof tmpO === "string") {
                tempKey = tmpO;
                tmpO = lTemp[tempKey];
            }
            if (!lTemp[tempKey]) {
                lTemp[tempKey] = template[tempKey].slice(0);
                if (typeof lTemp[tempKey][0] === "function") {
                    lTemp[tempKey][0] = Strings.has(lTemp[tempKey][0].name) || "[Function]";
                }

                lTemp[tempKey][0] = `<${lTemp[tempKey][0]}>`
            }
            lTemp[tempKey][0] = key + ", " + lTemp[tempKey][0];
            if (lTemp[tempKey][0].length > maxLengthFirst) maxLengthFirst = lTemp[tempKey][0].length;
        }
        CommandHelper.writeHelp(this.props.name, lTemp);
        if(this.props.onHelp) {
            this.props.onHelp(command, commandOption, i, options, argv, flags);
        }
        process.exit(0);
    }

    private static writeHelp(name, mapArray) {
        const Table = require('cli-table');
        let table = new Table({
            colWidths: [30, 20, 40],
            chars: {
                'top': '',
                'top-mid': '',
                'top-left': '',
                'top-right': '',
                'bottom': '=',
                'bottom-mid': '',
                'bottom-left': '',
                'bottom-right': '',
                'left': '',
                'left-mid': '',
                'mid': '',
                'mid-mid': '',
                'right': '',
                'right-mid': '',
                'middle': ' '
            },
            style: {'padding-left': 4, 'padding-right': 0}
        });
        console.log(` Usage: ${name} [options]\n`);
        console.log(` Options: \n`);
        table.push(["Command", "Default", "Description"]);
        console.log(table.toString());
        table.splice(0);
        table.options.chars.bottom = "-";
        for (let key in mapArray) {
            if (Objects.hasProperty(mapArray, key)) {
                let row = mapArray[key];
                let description = row.length > 1 ? Strings.toString(row[1]) : "";
                let def = row.length > 2 ? Strings.toString(row[2]) : "";
                row[1] = def;
                row[2] = description;
                table.push(row);
            }
        }
        console.log(table.toString());
    }

    static Boolean(command, commandOption, i, options, argv, flags): Result {
        if (hasValue(options[command])) return;
        options[command] = !commandOption[2];
        return {
            removes: [i]
        };
    }

    static String(command, commandOption, i, options, argv, flags): Result {
        if (hasValue(options[command])) return;
        let removes;
        let skipStep = i;
        if (flags.length === 2) {
            options[command] = flags[1];
            removes = [i];
        } else if (argv.length > (++skipStep) && !Strings.startsWith(argv[skipStep], "-")) {
            options[command] = argv[skipStep];
            removes = [skipStep - 1, skipStep];
        }
        if (!removes) return;
        return {
            removes,
            skipStep
        }
    }

    static Array(command, commandOption, i, options, argv, flags): Result {
        if (hasValue(options[command])) return;
        let values = [];
        let removes = [];
        let skipStep = i; // Array Next Value index
        while (argv.length > (++skipStep) && !Strings.startsWith(argv[skipStep], "-")) {
            values.push(argv[skipStep]);
            removes.push(skipStep);
        }
        if (values.length > 0) {
            options[command] = values;
            return {
                removes,
                skipStep
            }
        }
    }

    static JsonFile(command, commandOption, i, options, argv, flags) {
        if (hasValue(options[command])) return;
        let removes;
        let skipStep = i;
        if (flags.length === 2) {
            options[command] =  JSON.parse(fs.readFileSync(resolve(process.cwd(), flags[1]), 'utf8'));
            removes = [i];
        } else if (argv.length > (++skipStep) && !Strings.startsWith(argv[skipStep], "-")) {
            options[command] =  JSON.parse(fs.readFileSync(resolve(process.cwd(), argv[skipStep]), 'utf8'));
            removes = [skipStep - 1, skipStep];
        }
        if (!removes) return;
        return {
            removes,
            skipStep
        }
    }
}

