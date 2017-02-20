import { resolve } from "path";
import {Controller} from "../../app/Controller";
import PropsClass from "../../lang/PropClass";
import Options from "./Options";
const getOptions = require('mocha/bin/options');


export default class MochaController extends PropsClass implements Controller {
    constructor(props){
        super(props);
        getOptions();
        this.props.opts = Options.parse(process.argv);
        this.init();
    }

    init(){
        let opts = this.props.opts;
        if (opts.requireMain.length === 1) {
            try {
                require(opts.requireMain[0])
            } catch (error) {
                this.onError(event, error);
            }
        }
        if (opts.interactive) {
            opts.renderer = true;
            opts.debug = true;
            opts.colors = false
        }
    }

    getUrl(){
        return {
            protocol: "file",
            slashes: true,
            pathname: resolve(__dirname, "index.html")
        };
    }

    events(){
        return {
            "on-renderer": this.onRendered,
            "on-completed": this.onCompleted,
            "on-error": this.onError
        }
    }

    onRendered(event, arg) {
        event.returnValue = this.props.opts;
    }

    onCompleted(event) {
        if(!this.props.opts.interactive) {
            this.props.quit();
        }
    }

    onError(event, error) {
        console.error(error);
    }
}

