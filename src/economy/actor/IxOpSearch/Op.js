import Fx from '../Fx';

const init = (ref) => {
    const {$options = {}} = ref.props;
    const op = Fx.initSearch($options);
    if (op.enabled) {
        /* 1. 搜索框专用 */
        const state = {};
        const search = {};
        search.style = {width: "72%"};
        search.placeholder = op.placeholder;
        search.onSearch = Fx.rxFilter(ref);
        state.search = search;
        /* 2. 条件处理 */
        state.cond = op.cond;
        /* 3. 高级搜索 */
        if (op.advanced) {
            state.advanced = {
                title: op['advanced.title'],
                width: op['advanced.width'],
                maskClosable: false,
                onClose: () => ref.setState({visible: false})
            };
        }
        ref.setState(state);
    }
};
const onClear = (reference) => event => {

};
const onOpen = (reference) => event => {
    event.preventDefault();
    reference.setState({visible: true});
};
export default {
    init,
    onClear,
    onOpen,
};