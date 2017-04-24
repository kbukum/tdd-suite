import ArgsParser from "../../util/ArgsParser";
import * as fs from "fs-extra";
import { resolve } from "path";
const packageJson = require("../../../package.json");

const list = (str) => {
    return str.split(/ *, */)
};

const modules = (mod, memo) => {
    const abs = fs.existsSync(mod) || fs.existsSync(mod + ".js");
    if (abs) mod = resolve(mod);
    memo.push(mod);
    return memo
};

const config = [
    ["-C, --no-colors", "force disabling of colors"],
    ["-R, --reporter <name>", "specify the reporter to use", "spec"],
    ["-S, --sort", "sort test files"],
    ["-b, --bail", "bail after first test failure"],
    ["-g, --grep <pattern>", "only run tests matching <pattern>"],
    ["-f, --fgrep <string>", "only run tests containing <string>"],
    ["-i, --invert", "inverts --grep and --fgrep matches"],
    ["-r, --require <name>", "require the given module", modules, []],
    ["-s, --slow <ms>", "'slow' test threshold in milliseconds [75]"],
    ["-t, --timeout <ms>", "set test-case timeout in milliseconds [2000]"],
    ["-u, --ui <name>", "specify user-interface (bdd|tdd|exports],", "bdd"],
    ["--check-leaks", "check for global variable leaks"],
    ["--compilers <ext>:<module>,...", "use the given module(s], to compile files", list, []],
    ["--debug", "enable Electron debugger on port [5858]; for --renderer tests show window and dev-tools"],
    ["--debug-brk <string>", "like --debug but pauses the script on the first line"],
    ["--globals <names>", "allow the given comma-delimited global [names]", list, []],
    ["--inline-diffs", "display actual/expected differences inline within each string"],
    ["--interactive", "run tests in renderer process in a visible window that can be reloaded to re-run tests"],
    ["--interfaces", "display available interfaces"],
    ["--no-timeouts", "disables timeouts"],
    ["--opts <path>", "specify opts path", "test/mocha.opts"],
    ["--recursive", "include sub directories"],
    ["--renderer", "run tests in renderer process"],
    ["--preload <name>", "preload the given script in renderer process", modules, []],
    ["--require-main <name>", "load the given script in main process before executing tests", modules, []]
];

export default class Options {
    static parse(args: string[]): any {
        let options = ArgsParser.parse(
            packageJson.name,
            packageJson.version,
            config,
            args,
            true
        );
        options.files = options.args;

        if (options.debugBrk) {
            options.debug = true
        }

        // delete unused
        ["commands", "options", "_execs", "_args", "_name", "_events", "_usage", "_version", "_eventsCount", "args"].forEach(function (key) {
            delete options[key]
        });

        return options
    }
}
