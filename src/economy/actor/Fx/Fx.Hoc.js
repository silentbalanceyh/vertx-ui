import Ux from "ux";
import U from 'underscore';
import InitGrid from './Fx.Init.Grid';

const BIND = {
    "grid": InitGrid
};
const verify = key => ref => {
    const {reference, $key = key} = ref.props;
    return Ux.verifyComplex(reference, $key);
};
const init = type => ref => {
    const fun = BIND[type];
    if (U.isFunction(fun)) {
        fun(ref);
    }
};
export default {
    verify,
    init
}