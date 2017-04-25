import Options from "./app/Options";
import Application from "./app/Application";

let options = Options.parse(process.argv);
let app = new Application({
    options: options
});
app.run();
