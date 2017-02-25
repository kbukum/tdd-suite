import {hasValue} from "../../util/Functions";
const {ipcMain} = require("electron");

export interface IpcEvents {
    [key: string]: (event, arg) => any;
}

export interface ControllerProps {
    [key: string]: any,
    args: string[],
    onReady(options?: {[key: string]: any}),
    quit: () => any
}

export interface Controller {
    start(callback)
    indexUrl?(): string,
    onRendered(event, arg);
    onCompleted(event, arg);
    onError(event, arg);
    onSuccess(event, arg);
    events(): IpcEvents;
}

export interface ControllerClass {
    new (props: ControllerProps): Controller
}
