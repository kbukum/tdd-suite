import * as fs from "fs-extra";
import { join } from "path";
import { requireEs6 } from "wasabi-common";
import PropsClass from "wasabi-common/lib/lang/PropClass";
import {Controller, ControllerClass} from "./Controller";
import {OptionsProps} from "./Options";
const electron = require("electron");
const { app } = electron;

export interface ApplicationProps {
    options: OptionsProps,
    args: string[]
}

export default class Application extends PropsClass {
    private tmpDir;
    controller: Controller;
    static defaultProps = {
    };
    private browser;
    /*
     *
     * @param props
     */
    public constructor(props: ApplicationProps){
        super(props);
        let Controller: ControllerClass = requireEs6(props.options.controllerPath);
        let { options, args } = this.props;
        this.controller = new Controller({
            options,
            args,
            quit: app.quit
        });
    }

    /**
     *
     */
    public run(){
        this.tmpDir = fs.mkdtempSync(join(app.getPath("temp"), "tdd-suite-"));
        app.setPath("userData", this.tmpDir);
        app.on("window-all-closed", this.onClosed);
        app.on("quit", this.onQuit);
        app.on("ready", this.onReady);
    }

    onClosed() {
        // do not quit if tests open and close windows

    }

    onQuit(){
        fs.removeSync(this.tmpDir);
    }

    onReady(){

    }
}