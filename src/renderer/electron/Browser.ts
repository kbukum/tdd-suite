import BrowserWindowOptions = Electron.BrowserWindowOptions;
import Window, {WindowProps} from "./Window";

export interface BrowserProps extends WindowProps {
    onDestroy();
}


export default class Browser extends Window {
    public constructor(props: BrowserProps) {
        super(props);
    }

    public destroy(){

    }
}