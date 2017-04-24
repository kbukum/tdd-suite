import { TemplateProps } from "command-helper/lib/api/Template";

export interface ControllerProps {
    options: TemplateProps
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
