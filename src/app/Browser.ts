import Window, { WindowProps } from "./Window";
import {Url} from "url";
import BrowserWindow = Electron.BrowserWindow;

export interface BrowserProps extends WindowProps {
    onDestroy();
}

export default class Browser extends Window {
    public constructor(props: BrowserProps) {
        super(props);
    }

    destroy(){
        this.window.close();
    }
}