import Fx from '../Fx';
import Ux from 'ux';

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
const initFilters = (ref) => {
    const data = {};
    const {$query = {}} = ref.props;
    const criteria = $query.criteria;
    if (!Ux.isEmpty(criteria)) {
        Object.keys(criteria).forEach(key => {
            if ("" === key) {
                data.connector = criteria[""] ? "AND" : "OR";
            } else {
                data[key] = criteria[key];
            }
        })
    } else {
        // 默认连接符使用的是 AND
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
    reference.setState({searchText})
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