const onSwitch = (reference) => ($switcher) => {
    reference.setState({$switcher})
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
    reference.setState(state);
};
const onClose = (reference) => (event) => {
    reference.setState({$expand: false})
};
export default {
    onClose,
    onSelected,
    onSwitch,
}