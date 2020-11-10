import Ux from "ux";

const tablePager = (reference, config = {}) => {
    const pager = {};
    if ("client" !== config.pagination) {
        pager.onChange = (pagination, filters, sorter) => {
            reference.setState({$loading: true, $visible: true});
            const {mock} = reference.props;
            if (config.ajax) {
                const params = Ux.xtLazyAjax(reference, config);
                params.pager.size = pagination.pageSize;
                params.pager.page = pagination.current;
                // 补充设置$page页面值
                Ux.asyncData(config.ajax, params, ($data) => reference.setState({
                    $loading: false, $data, $page: pagination.current
                }), mock);
            }
        };
        const {$data = {}, $page} = reference.state;
        /* 分页处理 */
        const pagination = {
            showQuickJumper: true
        };
        pagination.total = $data.count;
        pagination.size = "small";
        if (config.ajax && config.ajax.params) {
            const pager = config.ajax.params.pager;
            Ux.E.fxTerminal(!pager, 10048, pager);
            if (pager) {
                pagination.pageSize = pager.size;
                pagination.current = $page ? $page : pager.page;
            }
        }
        pager.pagination = pagination;
    } else {
        pager.pagination = true;
    }
    return pager;
};
const tableConfig = (reference, config = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {table = {}} = config;
    /*
     * mountKey 针对所有记录
     */
    const mountKey = (input) => {
        /*
         * 执行内部的 Key 操作
         */
        const keyFn = (item) => {
            if (item.key) {
                item._key = item.key
            }
        }
        if (Ux.isArray(input)) {
            input.forEach(item => keyFn(item));
        } else if (Ux.isObject(input)) {
            keyFn(input);
        }
    }
    /*
     * table 中的 columns 注入
     */
    const columns = Ux.configColumn(ref, table.columns ? table.columns : []);
    const rowSelection = {}
    const {selection} = config;
    if (selection && selection.multiple) {
        /*
         * 多选
         */
        rowSelection.onChange = (keys = []) => {
            const {$data = {}} = reference.state;
            if (0 < keys.length) {
                const {list = []} = $data;
                const $keys = new Set(keys);
                const $keySet = list.filter(item => $keys.has(item.key));
                mountKey($keySet);

                reference.setState({$keySet});
            } else {
                // 反选
                reference.setState({$keySet: undefined});
            }
        }
    } else {
        /*
         * 单选
         */
        rowSelection.type = 'radio';
        rowSelection.onSelect = ($keySet) => {
            mountKey($keySet);
            // 更新
            reference.setState({$keySet});
        }
    }
    const tableAttrs = {};
    tableAttrs.columns = columns;
    tableAttrs.rowSelection = rowSelection;
    return tableAttrs;
}
export default {
    tablePager,
    tableConfig,
}