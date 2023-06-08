import Ux from 'ux';

const onSwitch = (reference) => ($switcher) => {
    Ux.of(reference).in({$switcher}).done();
    // reference.?etState({$switcher})
};
const onSelected = (reference) => (item) => {
    /*
     * 展开页面操作
     */
    const state = {};
    state.$expand = true;
    const data = item.item.props.data;
    state.$selected = {
        key: item.key,
        /* 特殊路径 */
        data
    };
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
};
const onClose = (reference) => (event) => {
    Ux.of(reference).in({$expand: false}).done();
    // reference.?etState({$expand: false})
};
export default {
    onClose,
    onSelected,
    onSwitch,
}