import Ux from 'ux';
import Ex from 'ex';

export default (reference, config = {}, state = {}) => Ux.parallel([
    Ex.rxColumn(reference, {
        ...config,
        columns: config.table ? config.table.columns : []
    })(),
    Ex.rxColumnMy(reference, config)()
], "columns", "filters")
    .then(response => {
        /*
         * 启用表达式模式的列处理
         */
        const {columns = []} = response;
        response.columns = Ux.configColumn(reference, columns);
        return Ux.promise(response);
    })
    .then(response => {
        const table = Ux.clone(config.table);
        /*
         * 静态列配置信息
         */
        let staticColumns = [];
        if (table.columns) {
            staticColumns = Ux.clone(table.columns)
        }
        /*
         * 配置 columns
         */
        table.columns = Ex.configColumn(table.columns, response);
        /*
         * 在 state 中引入 全量 / 我的 概念
         * 全列 = 静态列 + 动态列
         * 静态列中主要包含了 Op 的操作列
         */
        state.$columns = Ux.clone(staticColumns.concat(response.columns));
        Object.freeze(state.$columns);
        state.$columnsMy = Ux.clone(table.columns)
            .map(column => column.dataIndex);
        /*
         * Qr 处理，生成 $terms 数据结构
         */
        state.$terms = Ux.qrTerms(table.columns);
        return Ux.promise(table);
    })
    .then(table => {
        /*
         * 额外步骤，检查 search.cond 和 列过滤的冲突
         * searchText 不能命中 列过滤中的 DIRECT 模式
         */
        const {config = {}} = reference.props;
        const {options = {}} = config;
        if (options[Ex.Opt.SEARCH_ENABLED]) {
            /*
             * 条件过滤
             */
            const fields = options[Ex.Opt.SEARCH_COND]
                .filter(condItem => "string" === typeof condItem)
                .map(condItem => condItem.split(','))
                .map(condArr => condArr[0])
                .filter(condItem => !!condItem);
            const prefixes = Object.keys(state.$terms)
                .filter(key => "STRING" !== state.$terms[key].dataType);
            /*
             * 计数器
             */
            const $cond = Ux.immutable(fields);
            prefixes.forEach(prefix => {
                if ($cond.contains(prefix)) {
                    console.error("[ Ex ] 配置 search.cond 和列过滤冲突！");
                    console.error(" --> search.cond = ", fields, "field = ", prefix);
                }
            })
        }
        return Ux.promise(table);
    });