import Class from "wasabi-common/lib/lang/Class";
import FrontendAdapter from "./FrontendAdapter";
import BackendAdapter from "../backend/BackendAdapter";
import Runner from "../Runner";
import ConsoleChannel from "../ConsoleChannel";

export interface FrontendAdapterImplProps {
    backendReference: BackendAdapter
    [key: string]: any
}

export default class FrontendAdapterImpl extends Class implements FrontendAdapter {
    props;
    runner: Runner;
    public constructor(props: FrontendAdapterImplProps) {
        super();
        this.props = props;
        if(!this.props.options.interactive) {
            ConsoleChannel.remote();
        }
    }

    public onReady(){
        this.props.backendReference.onClientReady(this);
    }

    public init(args: any[]){
        this.runner = new Runner({
            options: args
        });
        this.start();
    }

    public start(){
        this.runner.run(this.onComplete);
    }

    public onComplete(){
        this.props.backendReference.onCompleted();
    }
}