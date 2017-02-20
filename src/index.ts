import Options, { OptionsProps } from "./app/Options";
import Application from "./app/Application";

let args: string[] = process.argv.slice(2);
let options: OptionsProps = Options.parse(args);
let application = new Application({
    options,
    args
});
application.run();