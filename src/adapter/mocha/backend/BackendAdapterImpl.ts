import Class from "wasabi-common/lib/lang/Class";
import BackendAdapter from "./BackendAdapter";
import FrontendAdapter from "../frontend/FrontendAdapter";
import Runner from "../Runner";

export default class BackendAdapterImpl extends Class implements BackendAdapter {
    props;
    frontendReference: FrontendAdapter;
    opts;
    runner;
    public constructor(props) {
        super();
        this.props = props;
    }
    public init(){
        this.opts = Runner.configureOptions(this.props.options);
    }
    public onClientReady(frontendReference: FrontendAdapter){
        this.frontendReference = frontendReference;
        this.frontendReference.init(this.opts);
    }

    public onCompleted(){
        process.exit(0);
    }

    public run() {
        this.init();
        this.runner = new Runner({
            options: this.opts
        });
        this.runner.run(this.onCompleted);
    }
}