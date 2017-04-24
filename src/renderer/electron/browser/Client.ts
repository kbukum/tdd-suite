import {requireEs6} from "wasabi-common";
import Class from "wasabi-common/lib/lang/Class";
const { ipcRenderer } = require("electron");

export interface ClientProps {
    adapter: string
}

export default class Client extends Class {
    private props;
    private adapter;
    public constructor(props: ClientProps){
        super();
        this.props = props;
        let FrontendAdapter = requireEs6(this.props.adapter);
        this.adapter = new FrontendAdapter({
            ...this.props
        });
    }

    public getAdapter(){
        return this.adapter;
    }
}
