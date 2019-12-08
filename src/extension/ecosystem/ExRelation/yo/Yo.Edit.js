/*
 * config 用于构造专用的 criteria 查询条件
 */

const onChange = (reference, key) => (keys = []) => {
    if ("up" === key) {
        reference.setState({$selectedUp: keys});
    } else {
        reference.setState({$selectedDown: keys});
    }
};

const editRow = (reference, key) => {
    const {$selectedUp = [], $selectedDown = []} =
        reference.state ? reference.state : {};
    const attrs = {};
    if ("up" === key) {
        attrs.selectedRowKeys = $selectedUp;
    } else {
        attrs.selectedRowKeys = $selectedDown;
    }
    return {
        onChange: onChange(reference, key),
        ...attrs
    }
};
/*
 * key 表示方向
 */
const editTable = (reference, $table = {}, key, combine) => {
    /*
     * 选择框专用处理
     */
    const {config = {}} = reference.props;
    if (config.editable) {
        $table.rowSelection = editRow(reference, key);
    }
};
const editTab = (reference, tabs = {}) => {
    tabs.onTabClick = (activeKey) => {
        /*
         * 暂时只清除
         */
        let $selectedCategory = [];
        if ("__DELETE__" !== activeKey) {
            $selectedCategory = [activeKey];
        }
        reference.setState({
            $selectedCategory,
            $selectedUp: [],
            $selectedDown: []
        })
    }
};
export default {
    editTable,
    editTab,
}