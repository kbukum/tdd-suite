import "./util/Resolver";
import Application from "./app/Application";
import {addModules, addBaseUrl} from "./util/Resolver";
import Options from "./Options";
import {requireEs6} from "./util/Functions";

const pOpts = require("../package.json");
// TODO change parser by Application.
let opts = Options.parse(process.argv);
addBaseUrl(opts.options.baseUrl);
let rootList = opts.options.rootList;
addModules(rootList);


const Adapter: any = requireEs6(opts.options.adapterClass);
if(!opts.options.renderer) {
    new Adapter({
        ...opts,
        quit: () => process.exit(1)
    }).run();
} else {
    new Adapter({
        ...opts,
        quit: () => {
            application.destroy();
            process.exit(1);
        }
    });
    let application = new Application({
        name: pOpts.name,
        renderer: opts.options.renderer,
        interactive: opts.options.interactive,
        debug: opts.options.debug,
        indexUrl: opts.options.indexUrl,
        version: pOpts.version
    });
    application.run();
}
