import {join} from "path";
import * as fs from "fs-extra";
const { app, ipcMain: ipc } = require("electron");
import Class from "../lang/Class";
import Browser from "./Browser";


export interface ApplicationProps {
    name: string,
    renderer: boolean,
    interactive: boolean,
    indexUrl: string,
    debug: boolean,
    version: string,
    onDeveloperToolsOpened?: () => void
}

export default class Application extends Class {
    props;
    tmpDir;
    browser: Browser;

    constructor(props: ApplicationProps) {
        super();
        this.props = props;
    }

    public run(){
        this.createTempDir();
        // TODO on ready to start
        if(this.props.renderer) {
            app.on("quit", this.onDestroy);
            app.on("ready", this.onReadyToStart);
            app.on('window-all-closed', this.destroy)
        } else {
            this.props.run();
            // this.adapter.start();
            return;
        }
    }

    public onReadyToStart() {
        // TODO if renderer is ok then browser will open
        try {
            this.browser = new Browser({
                window: {
                    width: 800,
                    height:800,
                    show: false,
                    focusable: this.props.interactive || this.props.debug,
                    webPreferences: {
                        webSecurity: false
                    }
                },
                onShown: this.onShown,
                onDestroy: this.onDestroy
            });
            this.browser.open({
                protocol: "file",
                slashes: true,
                pathname: this.props.indexUrl
            });
            /*
            if (!(this.props.interactive || this.props.debug) && process.platform === "darwin") {
                app.dock.hide()
            }
            */
        } catch (e) {
            console.error(e);
            this.destroy();
        }
        // TODO else just need to call Runner
    }

    public onDestroy(){

    }
    public destroy(){
        this.browser.destroy();
        this.removeTempDir();
        app.quit();
    }

    private createTempDir() {
        this.tmpDir = fs.mkdtempSync(join(app.getPath("temp"), this.props.name));
        app.setPath("userData", this.tmpDir);
    }

    private onShown() {
        this.browser.openDeveloperTools((window) => {
            if(this.props.onDeveloperToolsOpened) {
                this.props.onDeveloperToolsOpened(this);
            }
        });
    }

    private removeTempDir(){
        if(this.tmpDir) {
            fs.removeSync(this.tmpDir);
            this.tmpDir = null;
        }
    }

    getProps(): ApplicationProps {
        return this.props;
    }
}