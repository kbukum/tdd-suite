import * as fs from "fs-extra";
import { join } from "path";
import Browser from "./Browser";
import PropsClass from "../lang/PropClass";
import {OptionsProps} from "./Options";
import {Controller, ControllerClass} from "./Controller";
import { requireMain } from "../util/Functions";
const electron = require('electron');
const {app} = electron;

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
    constructor(props: ApplicationProps) {
        super(props);
        let Controller: ControllerClass = requireMain(props.options.controllerPath);
        let { options, args } = this.props;
        this.controller = new Controller({
            options,
            args,
            quit: app.quit
        });
    }
    run(){
        this.tmpDir = fs.mkdtempSync(join(app.getPath('temp'), 'tdd-suite-'));
        app.setPath('userData', this.tmpDir);
        app.on('window-all-closed', this.onClosed);
        app.on('quit', this.onQuit);
        app.on('ready', this.onReady);
    }

    onClosed() {
        // do not quit if tests open and close windows

    }

    onQuit(){
        fs.removeSync(this.tmpDir);
    }

    onReady(){
        this.browser = new Browser({
            width: 800,
            height: 800,
            url: this.controller.getUrl(),
            events: this.controller.events()
        });
        this.browser.openBrowser();
    }
}