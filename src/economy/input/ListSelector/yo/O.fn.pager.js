import Ux from "ux";

export default (reference, config = {}) => {
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