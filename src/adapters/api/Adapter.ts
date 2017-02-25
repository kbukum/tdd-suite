interface Adapter {
    onRenderedLoaded(event, arg);
    onRenderedBeforeStart(event, arg);
    onRenderedCompleted(event, arg);
}

export interface AdapterClass {
    new (props): Adapter
}

export default Adapter;
