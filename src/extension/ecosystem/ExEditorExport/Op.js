import Ux from 'ux';
import Event from './Op.Event';

const yiEditor = (reference) => {
    const {config = {}} = reference.props;
    const state = {};
    /*
     * notice 专用
     */
    const {notice = {}} = config;
    state.$notice = Ux.clone(notice);
    /*
     * 选项处理
     */
    const {$columns = [], button = ""} = config;
    const $options = $columns.map(column => {
        const option = {};
        option.key = column.dataIndex;
        option.label = column.title;
        option.value = column.dataIndex;
        return option;
    }).filter(column => "key" !== column.key);
    state.$options = $options;

    state.$selected = []; // Ux.clone($columnsMy);
    /*
     * Group专用
     */
    const group = {};
    group.onChange = (selected = []) => {
        /*
         * 设置选中项
         * 按照列呈现的本身顺序进行排序
         */
        const $selectedKeys = Ux.immutable(selected);
        const $selected = [];
        $options
            .filter(item => $selectedKeys.contains(item.key))
            .forEach(item => $selected.push(item.key));
        reference.setState({$selected});
    };
    group.className = "group";
    state.$group = group;
    /*
     * 按钮专用选项
     */
    if ("string" === typeof button) {
        const $button = {};
        $button.id = button;
        $button.className = "ux-hidden";
        $button.onClick = Event.rxExport(reference);
        state.$button = $button;
    }
    state.$ready = true;
    reference.setState(state);
};
export default {
    yiEditor,
}