import Ele from '../element';
import Ajax from './O.ajax';
import Abs from '../abyss';
import T from '../unity';

/**
 * ## 特殊函数
 *
 * 异步表格列渲染专用预处理函数。在表格渲染中，如果使用了字典如：
 *
 * ### 数据结构
 *
 * #### 字典配置
 *
 * ```json
 * [
 *      {
 *          "key": "9db923a3-e13b-4e4f-b468-8f026c9aa1ab",
 *          "name": "测试标签"
 *      },
 *      {
 *          "key": "72180b29-8c33-4419-a312-405d66a67521",
 *          "name": "正式标签"
 *      },
 *      {
 *          "key": "1dd8ff65-b570-483d-a98d-fe987fd25c03",
 *          "name": "特殊标签"
 *      }
 * ]
 * ```
 *
 * 上述结构中，表格列里存储的数据是 key，而不是 name，但在表格呈现时需要呈现 name字段的信息，这种情况下需要执行 ajaxEager
 * 进行预处理。如配置和数据分别如下：
 *
 * #### config 配置
 *
 * ```json
 * [
 *      {
 *          "dataIndex": "labelKey",
 *          "title": "标签",
 *          "$render": "USER",
 *          "$config": {
 *              "uri": "异步专用Ajax",
 *              "expr": "呈现专用表达式",
 *              "field": "name，读取数据中需要解析的字段"
 *          }
 *      }
 * ]
 * ```
 *
 * #### data 数据
 *
 * ```json
 * [
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录1" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录2" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录3" },
 *      { labelKey:"9db923a3-e13b-4e4f-b468-8f026c9aa1ab", name:"记录4" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录5" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录6" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录7" },
 *      { labelKey:"72180b29-8c33-4419-a312-405d66a67521", name:"记录8" }
 * ]
 * ```
 *
 * ### 核心分析
 *
 * 上述数据中，只有两类`labelKey`出现，如果表格的每个单元格都调用 Ajax 异步处理数据，那么上述数据会执行`8`次异步访问记录
 * 而 `ajaxEager` 函数就是为这种情况量身打造的异步渲染函数，如果调用`ajaxEager`则只会访问两次，通过这种方式在一页呈现数据
 * 量大的时候会大规模减少和服务端的交互，为了性能考虑，可以使用这个函数来实现，上述例子中最终函数会返回如下数据格式。
 *
 * ```json
 * {
 *      "9db923a3-e13b-4e4f-b468-8f026c9aa1ab": "测试标签",
 *      "72180b29-8c33-4419-a312-405d66a67521": "正式标签"
 * }
 * ```
 *
 * 上述结构是当前页的数据中的数据，`特殊标签`由于在本页数据中没使用，所以不会读取到，ajaxEager函数主要的实现考虑有两点：
 *
 * * 减少和服务端交互的次数，根据本页数据直接分页构造分组型请求。
 * * 减少所需数据量，只读取合法字典中的数据。
 *
 * @async
 * @memberOf module:_ajax
 * @param {ReactComponent} reference 【保留】React组件引用
 * @param {Array} columns 表格配置中的 `columns` 属性
 * @param {Array} data 表格已经加载好的二维数据信息
 * @return {Promise<T>} 特殊结构处理表格渲染专用
 */
const ajaxEager = (reference, columns = [], data = []) => {
    // console.info(columns);
    const lazyAsync = [];
    columns.forEach(column => {
        const config = column.$config;
        if (Abs.isObject(config)) {
            const {uri, field, expr, batch = false} = config;
            if (batch) {
                /*
                 * 批量处理只能使用查询引擎
                 */
                const dataKeys = data.map(item => item[column.dataIndex]);
                const criteria = {};
                criteria[`key,i`] = dataKeys;
                lazyAsync.push(Ajax.ajaxPost(uri, {criteria}).then((response = {}) => {
                    const {list = []} = response;
                    /*
                     * 批量连接，直接构造
                     */
                    const result = {};
                    list.forEach(item => {
                        let value;
                        if (expr) {
                            value = T.formatExpr(expr, item, true);
                        } else {
                            value = item[field];
                        }
                        result[item.key] = value;
                    });
                    if (column["$empty"]) {
                        result['undefined'] = column["$empty"];
                    }
                    return Abs.promise(result);
                }));
            } else {
                /*
                 * 将 data 按 column 分组，原始模式
                 */
                const dataMap = Ele.elementGroup(data, column.dataIndex);
                const vertical = [];
                const verticalKeys = Object.keys(dataMap);
                verticalKeys.forEach(key => {
                    if ("undefined" === key) {
                        vertical.push(Abs.promise(column["$empty"] ? column['$empty'] : ""));
                    } else {
                        vertical.push(Ajax.ajaxGet(uri, {key}).then(result => {
                            let value;
                            if (expr) {
                                value = T.formatExpr(expr, result, true);
                            } else {
                                value = result[field];
                            }
                            return Abs.promise(value);
                        }));
                    }
                });
                /*
                 * vertical 结果
                 */
                lazyAsync.push(Abs.parallel(vertical).then(response => {
                    const result = {};
                    response.forEach((each, keyIndex) => {
                        result[verticalKeys[keyIndex]] = each;
                    });
                    return Abs.promise(result);
                }));
            }
        }
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