// In the main process.
import * as UrlFormat from "url";
const { BrowserWindow } = require("electron");
import BrowserWindowOptions = Electron.BrowserWindowOptions;
import PropsClass from "../lang/PropClass";
import Constants from "../Constants";
import {hasValue} from "../util/Functions";

export interface WindowProps {
    window: BrowserWindowOptions,
    onFinishLoad?: (window) => boolean;
    onShown: (window) => any;
    parent?: any
}

export default class Window extends PropsClass {
    protected window ;
    public props;
    public static defaultProps = {
        window: {
            show: true
        }
    };

    public constructor(props: WindowProps) {
        super(props);
        this.window = new BrowserWindow(this.props.window);
        this.window.on("close", this.onClose);
        this.window.on("closed", this.onClosed);
        this.window.webContents.once("did-finish-load", this.onFinishLoad)

    }

    open(urlFormat: UrlFormat.Url){
        let url;
        if(urlFormat.pathname.match(Constants.urlPattern)) {
            url = urlFormat.pathname;
        } else {
            if(!hasValue(urlFormat.protocol)) {
                urlFormat.protocol = "file";
            }
            if(!hasValue(urlFormat.slashes)) {
                urlFormat.slashes = true;
            }
            url = UrlFormat.format(urlFormat);
        }
        // undocumented call in electron-window
        this.window.loadURL(url);
    }
    onFinishLoad() {
        if(this.props.window.show) {
           this.show();
        } else if(this.props.onFinishLoad) {
            if(this.props.onFinishLoad() !== false) {
                this.show();
            }
        }
    }

    show(){
        this.window.show();
        if(this.props.onShown) {
            this.props.onShown(this);
        }

    }

    openDeveloperTools(callback) {
        this.window.webContents.on("devtools-opened", callback.bind(undefined , this));
        this.window.openDevTools();
    }

    onClose(){

    }

    onClosed(){
        this.window = null;
    }
}