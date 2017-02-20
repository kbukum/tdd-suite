import Class from "./Class";
import * as merge from "deepmerge";

export interface IPropClass {
    props: any
}
abstract class PropsClass extends Class implements IPropClass {
    props: any;
    constructor(props: any, defaultProps?: any) {
        super();
        let defProps = defaultProps || this.constructor["defaultProps"];
        this.props = defProps ? PropsClass.merge(props, defProps): props;
    }
    static merge<T>(props: any, defaultProps: any) {
        return merge(props, defaultProps);
    }
}

export default PropsClass;
