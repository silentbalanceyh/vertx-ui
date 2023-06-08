import __Zn from './zero.module.dependency';
import __CFG from './equip.fn.config.container';

const cabTab = (reference = {}, key = "tabs") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const tabs = $hoc._(key);
        if (!__Zn.isEmpty(tabs)) {
            return __CFG.configTab(reference, __Zn.clone(tabs));
        } else return {};
    } else return {};
}
const capTab = (reference = {}, key = "tabs", state = {}) => {
    state.$tabs = cabTab(reference, key);
    return __Zn.promise(state);
}
const cabQuery = (reference, key = "grid") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const config = $hoc._(key);
        if (config && config.query) {
            /*
             * 构造 $query
             */
            return __Zn.qrCombine(config.query, reference);
        }
    }
};
export default {
    cabTab,
    capTab,

    cabQuery,
}