import PropsClass from "../lang/PropClass";
import Constants from "../Constants";
var electron = require('electron');
var {app, BrowserWindow, ipcMain} = electron;

export interface BrowserProps {
    url: {
        protocol?: "file" | "http" | "https"
        slashes?: boolean
        pathname: string
    },
    width: number
    height: number,
    events: {
        [key: string]: (event, arg) => any
    }
}

export default class Browser extends PropsClass {
    props;
    static defaultProps = {
        url: {
            protocol: "file",
            slashes: true
        }
    };
    private mainWindow;
    constructor(props: BrowserProps) {
        super(props);
    }
    openBrowser(){
        let {url, events, ...windowProps } = this.props;

        let urlString = url.pathname.match(Constants.urlPattern) ? url.pathname: require('url').format(url);
        this.mainWindow = new BrowserWindow(windowProps);
        this.mainWindow.loadURL(urlString);
        this.mainWindow.openDevTools();
        if(events) {
            for(let key in events) {
                if(events.hasOwnProperty(key)) {
                    ipcMain.on(key, events[key]);
                }
            }
        }
    }

    getMainWindow(){
        return this.mainWindow;
    }
}