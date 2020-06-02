import Ux from 'ux';

const executor = {
    "aiTitle": (props, component) => {
        const raft = Ux.fromPath(component, "message", "raft");
        const init = {};
        init.title = raft.title;
        return init;
    }
}
export default (reference, type) => {
    const fnInit = executor[type];
    const config = {};
    if (Ux.isFunction(fnInit)) {
        const ref = Ux.onReference(reference, 1);
        const initState = fnInit(reference.props, ref);
        if (initState) {
            Object.assign(config, initState);
        }
    }
    return config;
}