import Class from "wasabi-common/lib/lang/Class";
const Mocha = require("mocha");
const { join, resolve } = require("path");
const {ipcRenderer } = require('electron');
import Options from "./Options";

export default class Runner extends Class {
    props;
    mocha;
    constructor(props) {
        super();
        this.props = props;
    }
    static configureOptions(options){
        const getOptions = require('mocha/bin/options');
        getOptions();
        let args = Options.argsToProps(process.argv);
        args = {
            ...args,
            ...options
        };
        return args;
    }

    run(callback){
        let args = this.props.options;
        const utils = Mocha.utils;
        const mocha = new Mocha();
        this.mocha = mocha;
        // infinite stack traces (this was pulled from Mocha source, may not be necessary)
        Error.stackTraceLimit = Infinity;
        mocha.reporter(this.props.options.reporter);
        mocha.ui(args.ui);
        if (args.inlineDiffs) mocha.useInlineDiffs(true);
        if (args.slow) mocha.suite.slow(args.slow);
        if (!args.timeouts) mocha.enableTimeouts(false);
        if (args.timeout) mocha.suite.timeout(args.timeout);
        // mocha.suite.bail(args.bail)
        if (args.grep) mocha.grep(new RegExp(args.grep));
        if (args.fgrep) mocha.grep(args.fgrep);
        if (args.invert) mocha.invert();
        if (args.checkLeaks) mocha.checkLeaks();
        mocha.globals(args.globals);
        // --no-colors
        mocha.useColors(args.colors);
        // default files to test/*.js
        let files = [];
        const extensions = ['js'];
        if (!args.files.length) args.files.push('test');
        args.files.forEach((arg) => {
            files = files.concat(utils.lookupFiles(arg, extensions, args.recursive))
        });

        args.compilers.forEach((compilers) => {
            let [ext, mod] = compilers.split(':');
            if (mod[0] === '.') mod = join(process.cwd(), mod);
            require(mod);
            extensions.push(ext)
        });
        args.require.forEach((mod) => {
            require(mod)
        });
        files = files.map((file) => resolve(file));
        if (args.sort) {
            files.sort()
        }
        mocha.asyncOnly = false;
        mocha.files = files;
        mocha.run(callback);
    }

    static complete(){
        ipcRenderer.send("onCompleted", 0);
    }

    static error(error){
        ipcRenderer.send("onError", error);
    }
}