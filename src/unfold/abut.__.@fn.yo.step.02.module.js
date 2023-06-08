import __yoModuleMix from './abut.__.@fn.yo.step.02.module.mix';
import Ux from 'ux';

const YO_FUN = {
    mix: __yoModuleMix,
}
export default (reference, setting = {}) => {
    const {
        layout = "mix"
    } = setting;
    const yoFn = YO_FUN[layout];
    return Ux.isFunction(yoFn) ? yoFn(reference) : {};
}