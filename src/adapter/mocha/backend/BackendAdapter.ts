import FrontendAdapter from "../frontend/FrontendAdapter";
interface BackendEndAdapter {
    frontendReference: FrontendAdapter
    onClientReady(frontend: FrontendAdapter);
    init();
    onCompleted();
}

export default BackendEndAdapter;
