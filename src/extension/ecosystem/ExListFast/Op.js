import Ux from 'ux';
import {Dsl} from "entity";

const rxRefresh = (reference, stateRef = {}, query = {}) => {
    const {rxSearch} = reference.props;
    if (Ux.isFunction(rxSearch)) {
        return rxSearch(query).then(response => {
            /*
             * response 结构
             * {
             *     "list": [],
             *     "count": 1
             * }
             */
            stateRef.$data = response;
            stateRef.$query = query;
            stateRef.$loading = false;
            const {$table = {}} = stateRef;
            return Ux.ajaxEager(reference, $table.columns, Ux.valueArray(response))
                .then($lazy => Ux.promise(stateRef, "$lazy", $lazy))
        })
    } else {
        console.error("对不起，API核心方法 rxSearch 不存在！");
        return Ux.promise({error: "对不起，API核心方法 rxSearch 丢失！"});
    }
}
const yoSelection = (reference, table = {}) => {
    const {selection} = table;
    if (selection) {
        /*
         * 优先从 props 中的 $selected 提取信息
         * 整个过程模拟得和 ExComplexList 一致，即以状态中的 $selected 为第二备选
         */
        let selectedRowKeys;
        const {$selected} = reference.props;
        if (undefined === $selected || !Ux.isArray($selected)) {
            const selected = reference.state ? reference.state.$selected : [];
            selectedRowKeys = Ux.isArray(selected) ? selected : [];
        } else {
            selectedRowKeys = $selected;
        }
        table.rowSelection = {
            selectedRowKeys,
            onChange: ($selected = []) => {
                Ux.of(reference).in({$selected}).handle(() => {
                    const {rxPostSelected} = reference.props;
                    if (rxPostSelected) {
                        const {$data = {}} = reference.state;
                        const dataArray = Ux.valueArray($data);
                        rxPostSelected(dataArray.filter(item => $selected.includes(item.key)));
                    }
                })
                // reference.?etState({$selected});
                // const {rxPostSelected} = reference.props;
                // if (rxPostSelected) {
                //     const {$data = {}} = reference.state;
                //     const dataArray = Ux.valueArray($data);
                //     rxPostSelected(dataArray.filter(item => $selected.includes(item.key)));
                // }
            },
            /* 行特殊控制（是否可选择） */
            getCheckboxProps: (record = {}) => Ux.pluginSelection(reference, record)
        }
        // 删除不需要的属性
        delete table.selection;
    }
    return table;
}
const yoQuery = (reference) => {
    /*
     * 1. 源头1，props中的 $query
     * 2. 源头2，state中的 $query（默认值）
     * 3. 源头3，内置事件引起的变化
     */
    let {$queryDefault = {}} = reference.state ? reference.state : {};
    $queryDefault = Ux.clone($queryDefault);
    {
        const {$query} = reference.props;
        // props中的$query
        const queryInput = Ux.qrCombine($query, reference);
        $queryDefault = Ux.qrCombine($queryDefault, reference, queryInput.criteria);
    }
    Ux.dgDebug($queryDefault, "最终生成查询条件", "#556B2F");
    return $queryDefault;
}
const yoRow = (reference, table = {}) => {
    const row = table.row;
    if (row) {
        table.onRow = (record) => {
            const result = {};
            const events = Ux.configExecutor(reference, {});
            Ux.itObject(row, (event, target) => {
                const executor = events[target];
                if (Ux.isFunction(executor)) {
                    result[event] = event => {
                        Ux.prevent(event);
                        executor(record.key, record, {
                            config: Ux.clone(row),
                            reference
                        });
                    }
                }
            });
            return result;
        }
        if (row.onDoubleClick) {
            table.rowClassName = "ux_op_dbclick";
        }
    }
    return table;
}
const onChange = (reference) => (pagination, filters, sorter) => {
    /*
     * 表格条件变更
     * 1. pagination：分页变更
     * 2. filters：筛选表更
     * 3. sorter：排序变更
     */
    Ux.of(reference).in({
            // FIX：带有 filters 的列同时使用排序和过滤时的排序不生效的问题
            $sorter: sorter
        }
    ).loading(false).handle(() => {
        Ux.dgDebug({
            pagination,
            filters,
            sorter
        }, "[ ExTable ] 改变条件专用事件");
        /*
             * 结合 Ant Design 中 Table 的特殊属性
             * filters 一般的格式是：field = []
             * 这种情况下，直接删除掉本身条件，即不包含 length = 0 的情况
             * 解决BUG
             * 1）后端 500
             * 2）主要原因 code,=: [] 这种格式会非法，= 和 [] 冲突
             */
        const $filters = {};
        Object.keys(filters)
            .filter(key => undefined !== filters[key])
            .filter(key => 1 < filters[key].length)
            .forEach(key => $filters[key] = filters[key]);
        /*
         * 由于当前引用的 props 中包含了 $query
         * 构造四个核心参数
         */
        const {$query = {}, $condition = {}, $terms = {}} = reference.props;    // 默认的 $query
        /*
         * 最终条件计算
         */
        Ux.dgQuery(reference, "Table 组件：$loading = false, onChange");
        // Fix
        const query = Ux.qrComplex($query, {
            state: {$condition, $terms, $filters},
            props: reference.props,
        });
        const queryRef = Dsl.getQuery(query, reference);
        /*
         * 分页参数处理
         */
        if (pagination) {
            const {current, pageSize} = pagination;
            /*
             * 分页动作触发
             */
            if (current && pageSize) {
                /*
                 * 分页信息
                 * 1. current 是当前页
                 * 2. pageSize 是每页数据
                 */
                queryRef.page(current).size(pageSize);
            }
        }
        /*
         * 执行排序操作
         */
        if (!sorter.hasOwnProperty('order')) {
            /*
             * 原始的排序信息
             */
            if (Ux.isArray($query.sorter) && 0 < $query.sorter.length) {
                queryRef.sort($query.sorter);
            } else {
                queryRef.sort([]);
            }
        } else {
            const {field = "", order = "ascend"} = sorter;
            const isAsc = "ascend" === order;
            /**
             * 排序信息
             * 设置排序字段和排序模式
             * 1. field是排序的字段
             * 2. isAsc是排序模式
             */
            queryRef.sort(field, isAsc);
        }
        const request = queryRef.to();
        /*
         * 最终的 Query 变更
         */
        const stateRef = Ux.clone(reference.state);
        rxRefresh(reference, stateRef, request)
            .then(Ux.pipe(reference))
    })
    // reference.?etState({
    //     $loading: true,
    //
    //     $sorter: sorter,
    // });
}
const yoPager = (reference, table = {}, data = {}) => {
    const {$query = {}} = reference.state;
    const {pager = {}} = $query;
    table.pagination = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: [
            '10', '20', '50', '100'
        ],
        // 解决多个列表切换的问题
        current: pager.page,
        pageSize: pager.size,
        total: data.count,
    }
    table.onChange = onChange(reference)
}
export default {
    rxRefresh,
    yoSelection,
    yoRow,
    yoQuery,
    yoPager,
}