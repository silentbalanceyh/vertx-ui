import Ux from 'ux';
import U from 'underscore';

const write = (ref, react = {}, redux = {}) => {
    if (redux) {
        Ux.writeTree(ref, redux);
    }
    const reactState = {};
    reactState.ready = true;
    if (react) {
        Object.assign(reactState, react);
    }
    ref.setState(reactState);
};
const consume = (reference, name) => consumer => {
    if (reference) {
        const fun = reference.props[name];
        if (U.isFunction(fun)) {
            if (U.isFunction(consumer)) {
                consumer(fun);
            }
        } else {
            throw new Error(`[Ex] ${name} 函数出错！`);
        }
    } else {
        throw new Error("[Ex] 空 reference 处理。");
    }
};
export default {
    write,
    consume,
}