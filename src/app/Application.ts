import PropsClass from "wasabi-common/lib/lang/PropClass";
import {OptionsProps} from "./Options";
import RendererFactory from "../renderer/RendererFactory";
import Constrants from "../Constants";

export interface ApplicationProps {
    options: OptionsProps
}

export default class Application extends PropsClass {
    public static defaultProps = {

    };
    public constructor(props: ApplicationProps){
        super(props)
    }

    public run(){
        let adapter = RendererFactory.createRenderer({
            tmpName: Constrants.tmpName,
            options: this.props.options
        });
        adapter.run({
            error: this.onError,
            start: this.onStart,
            finished: this.onFinished,
            completed: this.onCompleted,
            quit: this.onQuit
        });
    }

    public onError(err){

    }

    public onStart(){
        console.log("onStarted...");
    }

    public onFinished(){
        console.log("onFinished...")
    }

    public onCompleted(){
        if(!this.props.options.interactive) {
           this.onQuit();
        }
    }

    public onQuit(){
        process.exit(0);
    }
}
