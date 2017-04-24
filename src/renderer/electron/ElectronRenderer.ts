import {join, resolve} from "path";
import * as fs from "fs-extra";
import Renderer, { RendererProps } from "../Renderer";
import { app } from "electron";
import Browser from "./Browser";
import Constants from "../../Constants";
import {requireEs6} from "wasabi-common";
import Backend from "./Backend";

export default class ElectronRenderer extends Renderer<RendererProps> {
    tmpDir;
    browser;
    backend;
    public start(){
        this.createTempDir();
        app.on("quit", this.events.quit);
        app.on("ready", this.onReady);
        app.on('window-all-closed', this.destroy);
    }

    public onReady(){
        this.browser = new Browser({
            window: {
                focusable: this.props.options.interactive || this.props.options.debug
            },
            onShown: this.onShown,
            onDestroy: this.onDestroy
        });

        let adapter = requireEs6(resolve(Constants.adapterPath, this.props.options.framework));
        this.backend = new Backend({
            window: this.browser.window,
            ...this.props,
            adapter: adapter.backend
        });

        this.browser.addOption("adapter", adapter.frontend);
        this.browser.addOption("backendReference", this.backend.getAdapter());
        this.browser.addOption("options", this.props.options);
        this.browser.open({
            protocol: "file",
            slashes: true,
            pathname: Constants.indexUrl
        });

        if(this.props.options.interactive) {
            this.browser.show();
        }
        this.backend.init();
    }

    public onDestroy(){

    }

    private onShown() {
        if(this.props.options.interactive) {
            this.browser.openDeveloperTools((window) => {
                console.log("Developer tools opened...");
            });
        }
    }

    public destroy(){
        this.browser.destroy();
        this.removeTempDir();
        app.quit();
    }

    private createTempDir() {
        this.tmpDir = fs.mkdtempSync(join(app.getPath("temp"), this.props.tmpName));
        app.setPath("userData", this.tmpDir);
    }

    private removeTempDir(){
        if(this.tmpDir) {
            fs.removeSync(this.tmpDir);
            this.tmpDir = null;
        }
    }
}