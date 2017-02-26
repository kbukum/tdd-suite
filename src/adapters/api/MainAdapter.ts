import Adapter from "./Adapter";
import Class from "../../lang/Class";
import Objects from "../../util/Objects";
import {error} from "util";
import {requireEs6} from "../../util/Functions";
const prompt = require("prompt");
const {ipcMain} = require("electron");

let retryKey = 'Retry (Y/N)';
const properties = [
];

properties.push({
    name: retryKey,
    validator: /Y|N$/
})


export default class MainAdapter extends Class implements Adapter {
    props;
    runner;
    constructor(props) {
        super();
        this.props = props;
        this.runner = requireEs6(this.props.options.tddRunner);
        this.props.options = this.runner.configureOptions(this.props.options);
        if(this.props.options.interactive && ! this.props.options.renderer) {
            prompt.start();
        } else if(this.props.options.renderer) {
            ipcMain.on("onRenderedLoaded", this.onRenderedLoaded);
            ipcMain.on("onRenderedBeforeStart", this.onRenderedBeforeStart);
            ipcMain.on("onRenderedCompleted", this.onRenderedCompleted);
        }
    }
    run() { // run tests on Node
        let me = this;
        let props = Objects.clone(this.props);
        const nodeRunner = new this.runner(props);
        nodeRunner.run((count) => {
            /*
            if(me.props.options.interactive) {
                prompt.get(properties, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if(result[retryKey] === "Y") {
                            me.run();
                        } else {
                            me.props.quit();
                        }
                    }
                });
            } else {
                me.props.quit();
            }
            */
            me.props.quit(count);
        });
    }

    onRenderedLoaded(event, arg) {
        event.returnValue = this.props.options;
    }
    onRenderedBeforeStart(event, arg) {
        event.sender.send("onMainConfirmStart", true);
    }
    onRenderedCompleted(event, arg) {
        if(MainAdapter.isSuccess(arg)) {
            this.quit(arg);
        } else {
            console.error(arg.message);
            console.error(arg.stack);
            arg = 1;
        }
        this.quit(arg);
    }
    quit(result){
        if(!this.props.options.interactive) {
            this.props.quit(result);
        }
    }
    static isSuccess(arg) {
        return arg === true || parseInt(arg) == arg;
    }
}