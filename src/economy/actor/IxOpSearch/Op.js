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
            /* 4. 高级搜索提示 */
            state.advancedNotice = $options['search.advanced.notice'];
        }
        ref.setState(state);
    }
};
/*
 * 根据 SearchText 来执行初始化，比搜索过后的内容更实时
 */
const initFilters = (ref) => {
    const data = {};
    const {$options = {}} = ref.props;
    const {searchText = ""} = ref.state;
    const cond = $options['search.cond'];
    if (searchText) {
        // 有值
        data.connector = "OR";
        cond.forEach(key => data[key] = searchText);
    } else {
        // 无值
        data.connector = "AND";
    }
    return data;
};
const onClear = (reference) => event => {
    event.preventDefault();
    Fx.rxFilter(reference)("");
    reference.setState({searchText: ""});
};
const onChange = (reference) => event => {
    event.preventDefault();
    const searchText = event.target.value;
    reference.setState({searchText});
};
const onOpen = (reference) => event => {
    event.preventDefault();
    reference.setState({visible: true});
};
export default {
    init,
    initFilters,
    onClear,
    onOpen,
    onChange,
};