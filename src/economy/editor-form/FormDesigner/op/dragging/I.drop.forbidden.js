import Ux from 'ux';

const fnForbidden = (component, key) => {
    /* 不可执行 */
    const forbidden = Ux.fromHoc(component, "forbidden");
    const message = forbidden[key];
    if (message) {
        Ux.messageFailure(message);
    }
    return false;
}

const executor = {
    "aiTitle": (props, component) => {
        const {config = {}} = props;
        if (24 === config.span) {
            return true;
        } else {
            return fnForbidden(component, 'aiTitle');
        }
    },
    "aiTransfer": (props, component) => {
        const {config = {}} = props;
        if (18 < config.span) {
            return true;
        } else {
            return fnForbidden(component, 'aiTransfer');
        }
    },
    "aiBraftEditor": (props, component) => {
        const {config = {}} = props;
        if (24 === config.span) {
            return true;
        } else {
            return fnForbidden(component, 'aiBraftEditor');
        }
    },
    "aiAddressSelector": (props, component) => {
        const {config = {}} = props;
        if (12 <= config.span) {
            return true;
        } else {
            return fnForbidden(component, 'aiAddressSelector');
        }
    },
    "aiTableEditor": (props, component) => {
        const {config = {}} = props;
        if (24 === config.span) {
            return true;
        } else {
            return fnForbidden(component, 'aiTableEditor');
        }
    }
}
export default (reference, type, consumer) => {
    const fnDrop = executor[type];
    let okForDrop = true;
    const ref = Ux.onReference(reference, 1);
    if (Ux.isFunction(fnDrop)) {
        okForDrop = fnDrop(reference.props, ref);
    }
    // 可以放入时执行
    if (okForDrop) {
        consumer(ref);
    }
}