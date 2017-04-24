import Renderer, { RendererProps} from "../Renderer";
import {requireEs6} from "wasabi-common";
import {resolve} from "path";
import Constants from "../../Constants";
import Backend from "../electron/Backend";

export default class NodeRenderer extends Renderer<RendererProps> {
    backend;
    public start() {
        let adapter = requireEs6(resolve(Constants.adapterPath, this.props.options.framework));
        this.backend = new Backend({
            ...this.props,
            adapter: adapter.backend
        }).run();
    }
}