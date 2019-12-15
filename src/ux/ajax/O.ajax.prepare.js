import Ele from '../element';
import Ajax from './O.ajax';
import Abs from '../abyss';
import T from '../unity';

const ajaxEager = (reference, columns = [], data = []) => {
    // console.info(columns);
    const lazyAsync = [];
    columns.forEach(column => {
        const config = column.$config;
        const {uri, field, expr} = config;
        /*
         * 将 data 按 column 分组
         */
        const dataMap = Ele.elementGroup(data, column.dataIndex);
        const vertical = [];
        const verticalKeys = Object.keys(dataMap);
        verticalKeys.forEach(key => {
            if ("undefined" === key) {
                vertical.push(Abs.promise(column["$empty"] ? column['$empty'] : ""));
            } else {
                vertical.push(Ajax.ajaxGet(uri, {key})
                    .then(result => {
                        let value;
                        if (expr) {
                            value = T.formatExpr(expr, result, true);
                        } else {
                            value = result[field];
                        }
                        return Abs.promise(value);
                    })
                );
            }
        });
        /*
         * vertical 结果
         */
        lazyAsync.push(Abs.parallel(vertical)
            .then(response => {
                const result = {};
                response.forEach((each, keyIndex) => {
                    result[verticalKeys[keyIndex]] = each;
                });
                return Abs.promise(result);
            }));
    });
    return Abs.parallel(lazyAsync)
        .then(response => {
            const lazyKeys = columns.map(column => column.dataIndex);
            const lazy = {};
            response.forEach((each, index) => {
                lazy[lazyKeys[index]] = each;
            });
            return Abs.promise(lazy);
        })
};

export default {
    ajaxEager
}