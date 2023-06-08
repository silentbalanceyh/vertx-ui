import __Zn from '../zero.uca.dependency';

const mountTitle = (reference, item = {}) => {
    const raft = __Zn.fromPath(reference, "message", "raft");
    item.title = raft.title;
}

const mountLabel = (reference, item = {}) => {
    const raft = __Zn.fromPath(reference, "message", "raft");
    item.optionItem = {label: raft.label};
}

const mountInput = (props, component) => {
    const item = {};
    mountLabel(component, item);
    return item;
}

const mountOption = (props, component) => {
    const item = {};
    mountLabel(component, item);
    const raft = __Zn.fromPath(component, "message", "raft");
    item.optionJsx = {config: {items: [__Zn.randomUUID() + "," + raft.option]}}
    return item;
}

const mountAttr = (props, component) => {
    const item = {};
    mountLabel(component, item);
    const raft = __Zn.fromPath(component, "message", "raft");
    item.optionJsx = {config: {items: [__Zn.randomUUID() + "," + raft.attribute]}}
    return item;
}
const mountArray = (props, component) => {
    const item = {};
    mountLabel(component, item);
    item.optionJsx = {config: {format: {type: "ARRAY"}}}
    return item;
}
const mountAction = (props, component) => {
    const item = {};
    const raft = __Zn.fromPath(component, "message", "raft");
    item.optionItem = {label: " "};
    item.optionJsx = {
        extension: [
            {
                key: "$opEmpty",
                text: raft.action.submit,
                type: "primary"
            }
        ]
    };
    return item;
}
const executor = {
    "aiTitle": (props, component) => {
        const init = {};
        mountTitle(component, init);
        return init;
    },
    "aiMagic": mountInput,
    "aiAction": mountAction,
    "aiInput": mountInput,
    "aiPassword": mountInput,
    "aiInputNumber": mountInput,
    "aiTextArea": mountInput,
    "aiSelect": mountInput,
    "aiTreeSelect": mountInput,
    "aiCheckbox": mountOption,
    "aiRadio": mountOption,
    "aiDatePicker": mountInput,
    "aiTimePicker": mountInput,
    "aiFileUpload": mountInput,
    "aiTransfer": mountInput,
    "aiBraftEditor": mountInput,
    "aiAddressSelector": mountInput,
    "aiDatumCascade": mountInput,
    "aiCheckJson": mountAttr,
    "aiListSelector": mountInput,
    "aiTreeSelector": mountInput,
    "aiTableEditor": mountArray,
    "aiDialogEditor": mountInput,
}
export default (reference, type) => {
    const fnInit = executor[type];
    const config = {};
    if (__Zn.isFunction(fnInit)) {
        const ref = __Zn.onReference(reference, 1);
        const initState = fnInit(reference.props, ref);
        if (initState) {
            Object.assign(config, initState);
        }
    }
    return config;
}