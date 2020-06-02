import Ux from 'ux';

const executor = {
    "aiTitle": (props, component) => {
        const {config = {}} = props;
        if (24 === config.span) {
            return true;
        } else {
            /* 不可执行 */
            const forbidden = Ux.fromHoc(component, "forbidden");
            const message = forbidden.aiTitle;
            if (message) {
                Ux.messageFailure(message);
            }
            return false;
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