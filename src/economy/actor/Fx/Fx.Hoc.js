import Ux from "ux";
import U from 'underscore';
import InitGrid from './Fx.Init.Grid';

const BIND = {
    "grid": InitGrid
};
const verify = type => ref => {
    const {reference, $key = type} = ref.props;
    return Ux.verifyComplex(reference, $key);
};
const init = type => async ref => {
    const fun = BIND[type];
    let finished = false;
    if (U.isFunction(fun)) {
        // 这里需要 type 处理 type
        finished = fun(type)(ref);
    }
    return finished;
};
export default {
    verify,
    init
}