import U from 'underscore';

export default (columns = []) => {
    /*
     * 在列确认之后，执行 $terms 变量的注入
     * $terms 记录了列变更的类型，用于后续的列变更专用处理
     */
    let $terms = {};
    if (U.isArray(columns)) {
        /*
         * 1）列定义中包含了当前字段（ dataIndex = field ）
         * 2）列定义中包含了 $filter 字段
         * 3）直接读取 $filter 中的 type 类型
         * 4）$filter 中的 type 值默认：INNER-DIRECT
         */
        columns.forEach(column => {
            const field = column.dataIndex;
            const filter = column['$filter'];
            if (filter) {
                $terms[field] = {};
                $terms[field].type = filter.type ? filter.type : "DIRECT";
                const {config = {}} = filter;
                if (config.dataType) {
                    $terms[field].dataType = config.dataType;
                } else {
                    /*
                     * 默认的搜索模式
                     */
                    $terms[field].dataType = "STRING";
                }
            }
        });
    }
    Object.freeze($terms);
    return $terms;
}