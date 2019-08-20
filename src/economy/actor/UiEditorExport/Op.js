import Fx from '../Fx';
import U from "underscore";

/**
 * 初始化列信息
 * @param reference
 */
const init = (reference) => {
    const {$config = {}} = reference.props;
    // 选中行处理，直接从表格中读取
    const columns = Fx.initColumnWithSelected(reference, $config);
    // notice处理
    const {notice = {}, button = ""} = $config;
    // 状态设置
    const state = {};
    state.$notice = notice;
    // 按钮ID
    state.$button = button;
    Object.assign(state, columns);
    reference.setState(state);
};
const onSelected = (reference, defaultSelected) => ($selected) => {
    if (U.isArray($selected)) {
        reference.setState({$selected});
    } else {
        if (defaultSelected) {
            reference.setState({$selected: defaultSelected});
        } else {
            reference.setState({$selected});
        }
    }
};
export default {
    init,
    onSelected
};