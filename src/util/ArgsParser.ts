export default class ArgsParser {
    static parse(name, version, config, argv, allowUnknown?: boolean){
        const program = require("commander");
        program.name = name;
        program
            .version(version);
        for(let i = 0 ; i < config.length; i++) {
            program.option.apply(program, config[i]);
        }
        if(allowUnknown) {
            program._allowUnknownOption = true;
        }
        program.parse(argv);
        const opts = JSON.parse(JSON.stringify(program));
        return opts;
    }
}