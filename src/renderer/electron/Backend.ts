import IpcMainEventListener = Electron.IpcMainEventListener;
import {OptionsProps} from "../../app/Options";
import { requireEs6 } from "wasabi-common";
import Class from "wasabi-common/lib/lang/Class";

export interface BackendProps {
    window: Window,
    options: OptionsProps,
    adapter: string
}

export default class Backend extends Class {
    private adapter;
    private props;

    /**
     *
     * @param props
     */
    public constructor(props: BackendProps){
        super();
        this.props = props;
        let BackendAdapter = requireEs6(this.props.adapter);
        this.adapter = new BackendAdapter({
            options: this.props.options
        });
    }

    public init(){
        this.getAdapter().init();
    }

    public getAdapter(){
        return this.adapter;
    }

    public run(){
        this.adapter.run();
    }
}