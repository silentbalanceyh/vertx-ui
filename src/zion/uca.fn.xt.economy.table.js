import __Zn from './zero.module.dependency';
import __XP from './uca.__.fn.xt.process';
import __LZ from './uca.fn.xt.lazy.loading';
/*
 * mountKey 针对所有记录
 */
const __xtMountKey = (input) => {
    /*
     * 执行内部的 Key 操作
     */
    const keyFn = (item) => {
        if (item.key) {
            item._key = item.key
        }
    }
    if (__Zn.isArray(input)) {
        input.forEach(item => keyFn(item));
    } else if (__Zn.isObject(input)) {
        keyFn(input);
    }
}
// 表格配置
const xtTablePager = (reference, config = {}) => {
    const pager = {};
    if ("client" !== config.pagination) {
        pager.onChange = (pagination, filters, sorter) => {
            __Zn.of(reference).loading(false).open().handle(() => {

                const {mock} = reference.props;
                if (config.ajax) {
                    const params = __LZ.xtLazyAjax(reference, config);
                    params.pager.size = pagination.pageSize;
                    params.pager.page = pagination.current;
                    // 补充设置$page页面值
                    __Zn.asyncData(config.ajax, params, ($data) => {
                        const state = {};
                        state.$loading = false;
                        state.$data = $data;
                        state.$page = pagination.current;
                        return __XP.xtTableLazy(reference, state, $data).then(processed => {


                            __Zn.of(reference).in(processed).done();
                            // reference.?etState(processed);
                        })
                    }, mock);
                }
            })
            // reference.?etState({$loading: true, $visible: true});
            // const {mock} = reference.props;
            // if (config.ajax) {
            //     const params = __LZ.xtLazyAjax(reference, config);
            //     params.pager.size = pagination.pageSize;
            //     params.pager.page = pagination.current;
            //     // 补充设置$page页面值
            //     __Zn.asyncData(config.ajax, params, ($data) => {
            //         const state = {};
            //         state.$loading = false;
            //         state.$data = $data;
            //         state.$page = pagination.current;
            //         return __XP.xtTableLazy(reference, state, $data)
            //             .then(processed => reference.?etState(processed))
            //     }, mock);
            // }
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
            __Zn.fxTerminal(!pager, 10048, pager);
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
const xtTableConfig = (reference, config = {}) => {
    // const ref = Ux.onReference(reference, 1);
    const {table = {}} = config;
    /*
     * table 中的 columns 注入
     */
    // const columns = Ux.configColumn(ref, table.columns ? table.columns : []);
    const rowSelection = {}
    const {selection} = config;
    const tableAttrs = {};
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
                __xtMountKey($keySet);

                __Zn.of(reference).in({
                    $keySet
                }).done();
                // reference.?etState({$keySet});
            } else {
                // 反选
                __Zn.of(reference).in({
                    $keySet: undefined
                }).done();
                // reference.?etState({$keySet: undefined});
            }
        }
    } else {
        /*
         * 单选
         */
        rowSelection.type = 'radio';
        rowSelection.onSelect = ($keySet) => {
            // __xtMountKey($keySet);
            __Zn.of(reference).in({
                $keySet
            }).handle(() => __xtMountKey($keySet))
            // reference.?etState({$keySet});
        }
        tableAttrs.onRow = ($keySet = {}) => {
            return {
                onClick: event => {
                    __Zn.prevent(event);

                    __Zn.of(reference).in({
                        $keySet
                    }).handle(() => __xtMountKey($keySet));
                    // reference.?etState({$keySet});
                }
            }
        }
    }
    tableAttrs.columns = table.columns;
    tableAttrs.rowSelection = rowSelection;
    return tableAttrs;
}
export default {
    xtTableConfig,
    xtTablePager
}