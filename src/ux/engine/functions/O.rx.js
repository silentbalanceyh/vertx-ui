/*
 * 根据分辨率计算核心高度
 * 1）width > 1400 的宽度：默认 - 48
 * 3）width > 1900 的宽度：默认 - 56
 */
import T from "./O.to";
import Abs from '../../abyss';
import {Dsl} from "entity";

const rxResize = (reference) => (adjust = 0) => {
    const maxHeight = T.toHeight("number" === typeof adjust ?
        adjust : 0);
    let $heightStyle = {style: {maxHeight}};
    reference.setState({$heightStyle});
};
const rxChecked = (reference, field = "$selected") => (keys = []) => {
    let state = reference.state ? reference.state : {};
    state = Abs.clone(state);
    const {$data = []} = state;
    const $selected = state[field] ? state[field] : [];
    if (0 < $data.length) {
        const $keys = Abs.immutable(keys);
        const selected = $data.filter(item => $keys.contains(item.key));
        /*
         * DataArray
         */
        const original = Dsl.getArray($selected);
        selected.forEach(each => original.saveElement(each));
        const checked = original.to();
        /*
         * Checked item
         */
        state[field] = checked ? checked : [];
        reference.setState(state);
    }
};
export default {
    rxResize,
    rxChecked
}