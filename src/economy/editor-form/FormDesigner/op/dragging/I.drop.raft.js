import Ux from 'ux';

const mountTitle = (reference, item = {}) => {
    const raft = Ux.fromPath(reference, "message", "raft");
    item.title = raft.title;
}

const mountLabel = (reference, item = {}) => {
    const raft = Ux.fromPath(reference, "message", "raft");
    item.optionItem = {label: raft.label};
}

const mountInput = (props, component) => {
    const item = {};
    mountLabel(component, item);
    return item;
}

const executor = {
    "aiTitle": (props, component) => {
        const init = {};
        mountTitle(component, init);
        return init;
    },
    "aiInput": mountInput,
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