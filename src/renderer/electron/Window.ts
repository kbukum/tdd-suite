// In the main process.
import * as UrlFormat from "url";
const { BrowserWindow } = require("electron");
import BrowserWindowOptions = Electron.BrowserWindowOptions;
import Constants from "../../Constants";
import PropsClass from "wasabi-common/lib/lang/PropClass";
import {has} from "wasabi-common";

export interface WindowProps {
    window?: BrowserWindowOptions,
    onFinishLoad?: (window) => boolean;
    onShown?: (window) => any;
    parent?: any
}

export default class Window extends PropsClass {
    protected window ;
    public props;
    public static defaultProps = {
        window: {
            width: 800,
            height:800,
            show: false,
            focusable: false,
            webPreferences: {
                webSecurity: false
            }
        }
    };
    public constructor(props: WindowProps) {
        super(props);
        let window: any = new BrowserWindow(this.props.window);
        this.window = window;
        window.options = {};
        window.getOption = (key) => {
            return window.options[key]
        };
        window.addOption = (key: string, value: any) => {
            window.options[key] = value;
        };
        this.window.on("close", this.onClose);
        this.window.on("closed", this.onClosed);
        this.window.webContents.once("did-finish-load", this.onFinishLoad)

    }

    open(urlFormat: UrlFormat.Url, options?){
        let url;
        if(urlFormat.pathname.match(Constants.urlPattern)) {
            url = urlFormat.pathname;
        } else {
            if(!has(urlFormat.protocol)) {
                urlFormat.protocol = "file";
            }
            if(!has(urlFormat.slashes)) {
                urlFormat.slashes = true;
            }
            url = UrlFormat.format(urlFormat);
        }
        // undocumented call in electron-window
        this.window.loadURL(url, options);
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

    addOption(key: string, value: any){
        this.window.addOption(key, value);
    }

    onClose(){

    }

    onClosed(){
        this.window = null;
    }
}