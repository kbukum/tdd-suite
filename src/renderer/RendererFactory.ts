import {OptionsProps} from "../app/Options";
import Renderer, { RendererProps } from "./Renderer";
import ElectronRenderer from "./electron/ElectronRenderer";
import NodeRenderer from "./node/NodeRenderer";


export interface RendererOptions {
    tmpName?: string
    options: OptionsProps
}

export default class RendererFactory {
    /**
     *
     * @param options
     * @return {any}
     */
    static createRenderer<T extends RendererProps>(options: RendererOptions): Renderer<T> {
        if(options.options.renderer) {
           return new ElectronRenderer(options);
       } else {
           return new NodeRenderer(options);
       }
    }
}
