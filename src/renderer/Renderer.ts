import {OptionsProps} from "../app/Options";
import PropsClass from "wasabi-common/lib/lang/PropClass";

export interface RendererProps {
    options: OptionsProps
}

export interface ApplicationEvents {
    error: (err) => void,
    start: () => void,
    finished: () => void,
    completed: () => void,
    quit: () => void
}

abstract class Renderer<T extends RendererProps> extends PropsClass {
    protected events: ApplicationEvents;
    public static defaultProps = {

    };
    constructor(props: T) {
        super(props);
    }

    public run(events: ApplicationEvents){
        this.events = events;
        this.start();
    }

    abstract start();
}

export default Renderer;
