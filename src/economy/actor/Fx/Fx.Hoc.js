import U from 'underscore';
import Grid from './Fx.Init.Grid';

const BIND = {
    "grid": Grid
};
const verify = type => ref => {
    const component = BIND[type];
    let error = null;
    if (U.isFunction(component.verify)) {
        error = component.verify(type)(ref);
    }
    return error;
};
const init = type => ref => {
    const component = BIND[type];
    let state = null;
    if (U.isFunction(component.init)) {
        // 这里需要 type 处理 type
        state = component.init(type)(ref);
    }
    return state;
};
export default {
    verify,
    init
};