import {OptionsProps} from "./Options";

export interface ControllerProps {
    options: OptionsProps
    args: string[],
    quit: () => any
}

export interface Controller {
    getUrl(): any
    events(): { [key: string]: (event, arg) => any }
}

export interface ControllerClass {
    new (props: ControllerProps): Controller
}
