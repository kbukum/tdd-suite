import {resolve} from "path";

let modules = {
    backend: resolve(__dirname, "backend/BackendAdapterImpl"),
    frontend: resolve(__dirname, "frontend/FrontendAdapterImpl")
};

export default modules;
