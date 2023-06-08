import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const ajaxEager = (reference, columns = [], data = []) => {
    /*
     *  矩阵型读取（优化版）
     * 1. 先过滤不同类型的列：["USER", "LAZY"]，目前支持的
     * 2. 构造新的列
     */
    const lazyColumns = columns.filter(item => [
        Cv.TYPE_LAZY_COLUMN.USER,
        Cv.TYPE_LAZY_COLUMN.LAZY
    ].includes(item.$render));
    if (0 < lazyColumns.length) {
        // Cached（是否已经读取过）
        const {$lazy = {}} = reference.state;
        const lazyAsync = [];
        lazyColumns.forEach(column => {
            // 拆开执行
            const config = column.$config;
            let lazyData = $lazy[column.dataIndex];
            if (!lazyData) lazyData = {};
            if (__Zn.isObject(config)) {
                // config 必须存在
                const {uri, field, expr, batch = false} = config;
                if (batch) {
                    /*
                     * 批量处理只能使用查询引擎
                     */
                    const dataKeys = data
                        .filter(item => !lazyData[item[column.dataIndex]])
                        .map(item => item[column.dataIndex]);
                    const criteria = {};
                    criteria[`key,i`] = dataKeys;
                    lazyAsync.push(__Zn.ajaxPost(uri, {criteria}).then((response = {}) => {
                        const {list = []} = response;
                        /*
                         * 批量连接，直接构造
                         */
                        const result = {};
                        list.forEach(item => {
                            let value;
                            if (expr) {
                                value = __Zn.formatExpr(expr, item, true);
                            } else {
                                value = item[field];
                            }
                            result[item.key] = value;
                        });
                        if (column[Cv.K_NAME.EMPTY]) {
                            result['undefined'] = column[Cv.K_NAME.EMPTY];
                        }
                        return __Zn.promise(result);
                    }));
                } else {
                    /*
                     * 将 data 按 column 分组，原始模式
                     */
                    const dataMap = __Zn.elementGroup(data, column.dataIndex);
                    const vertical = [];
                    const verticalKeys = Object.keys(dataMap).filter(key => !lazyData[key]);
                    verticalKeys.forEach(key => {
                        if ("undefined" === key) {
                            vertical.push(__Zn.promise(column[Cv.K_NAME.EMPTY] ? column[Cv.K_NAME.EMPTY] : ""));
                        } else if (key.length !== 36) {
                            vertical.push(__Zn.promise(column[Cv.K_NAME.EMPTY] ? column[Cv.K_NAME.EMPTY] : key));
                        } else {
                            vertical.push(__Zn.ajaxGet(uri, {key}).then(result => {
                                let value;
                                if (__Zn.isEmpty(result)) {
                                    value = undefined;
                                } else {
                                    if (expr) {
                                        value = __Zn.formatExpr(expr, result, true);
                                    } else {
                                        value = result[field];
                                    }
                                }
                                return __Zn.promise(value);
                            }));
                        }
                    });
                    /*
                     * vertical 结果
                     */
                    lazyAsync.push(__Zn.parallel(vertical).then(response => {
                        const result = {};
                        response.forEach((each, keyIndex) => {
                            result[verticalKeys[keyIndex]] = each;
                        });
                        Object.assign(result, lazyData);
                        return __Zn.promise(result);
                    }));
                }
            }
        });
        return __Zn.parallel(lazyAsync).then(response => {
            const lazyKeys = lazyColumns.map(column => column.dataIndex);
            const lazy = {};
            response.forEach((each, index) => lazy[lazyKeys[index]] = each);
            return __Zn.promise(lazy);
        })
    } else {
        // 什么都需要做
        return __Zn.promise({});
    }
};

export default {
    ajaxEager,
}