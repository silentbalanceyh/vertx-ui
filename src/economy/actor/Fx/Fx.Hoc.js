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
const init = type => ref => {
    const fun = BIND[type];
    if (U.isFunction(fun)) {
        // 这里需要 type 处理 type
        fun(type)(ref);
    }
};
export default {
    verify,
    init
}