import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const __dataIngest = (sourceData, config = {}, reference) => {
    const {
        inPath,
        outType,
    } = config;
    if (__Zn.isArray(sourceData)) {
        return sourceData
            .map(each => __dataIngest(each, config, reference))
            .filter(each => !!each);
    } else if (__Zn.isObject(sourceData)) {
        /*
         * inPath 类型判断转换成统一的 path
         * 1. 包含了 : （多值结果集）
         * 2. 不包含 : （单值结果集）
         */
        if (0 <= inPath.indexOf(":")) {
            /*
             *  参考下边的示例程序
             *  source:{
             *      "a": {
             *          "key": "key1",
             *          "a": true,
             *      },
             *      "b": {
             *          "key": "key2",
             *          "b": true,
             *      },
             *      "c": {
             *          "key": "key3",
             *          "c": false
             *      }
             *  }
             * 1.1. inPath = :field.key
             *      outType = ARRAY
             *      => [key1, key2, key3]
             *
             * 1.2. inPath = :field.key
             *      outType = ARRAY
             *      => {
             *         "a": "key1",
             *         "b": "key2",
             *         "c": "key3"
             *      }
             *
             * 2.1. inPath = :field.:field
             *      outType = ARRAY
             *      => [true, true, true]
             *
             * 2.2. inPath = :field.:field
             *      outType = Object
             *      => {
             *          "a": true,
             *          "b": true,
             *          "c": true
             *      }
             */
            if ("ARRAY" === outType) {
                // 只关注路径下的值，构造完成的 Array 返回
                const result = [];
                Object.keys(sourceData).forEach(field => {
                    const path = __Zn.formatExpr(inPath, {field}, true);
                    if (path) {
                        result.push(__Zn.valuePath(sourceData, path));
                    }
                })
                return result;
            } else if ("OBJECT" === outType) {
                // 同时关注路径下的键值
                const result = {};
                Object.keys(sourceData).forEach(field => {
                    const path = __Zn.formatExpr(inPath, {field}, true);
                    if (path) {
                        result[field] = __Zn.valuePath(sourceData, path);
                    }
                })
                return result;
            }
        } else {
            // 单值结果集
            return __Zn.valuePath(sourceData, inPath);
        }
    }
}

const __dataPre = (request = {}, config = {}) => {
    const {
        inPre
    } = config;
    if (inPre) {
        let checked = true;
        Object.keys(inPre).forEach(field => {
            let expected = inPre[field];
            let actual = request[field];
            if (String(expected) !== String(actual)) {
                /*
                 * 深度检查，如 undefined, false, 0, "" 表示相同意思
                 */
                expected = !!expected;
                actual = !!actual;
                if (expected !== actual) {
                    checked = false;
                }
            }
        });
        return checked;
    } else return true;
}

const dataIo = (request = {}, config = {}, reference) => {
    /*
     * 出现 writer 时，最终结果允许出现
     * null, undefined, 0 等不合法的值（反选删除）
     */
    const {
        inSource,
        inPath,
        outType,
    } = config;
    // inPre 检查
    if (inSource && __dataPre(request, config, reference)) {
        // sourceData
        const sourceData = request[inSource];
        // 1. sourceData 无值
        if (!sourceData) {
            // request[inField] = undefined;
            return;
        }
        // 2. 有 inPath，则直接解析
        if (inPath) {
            return __dataIngest(sourceData, {
                inPath,     // 数据采集路径
                outType,    // 输出类型：ARRAY / OBJECT
            }, reference);
        }
        // 3. 没有 inPath，直接返回 sourceData
        return __Zn.clone(sourceData);
    }
}
const dataWrite = (request = {}, io = {}, reference) => {
    const {writer = {}} = io;
    if (__Zn.isNotEmpty(writer)) {
        __Zn.dgDebug(writer, "[Data Writer] 转换器", "#008B00");
        Object.keys(writer).forEach(field => {
            const config = writer[field];
            request[field] = dataIo(request, {
                ...config,
                inField: field,
            }, reference);
        })
    }
}
const dataRead = ($inited = {}, config = {}, reference) => {

}
const dataRequest = (params = {}) => {
    // 执行默认参数处理
    const data = __Zn.clone(params);
    /* 记录中的语言信息 */
    data.language = Cv['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /* 默认记录启用 */
        data.active = true;
    }
    /*
     * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
     * X-App-Id, X-App-Key, X-Sigma
     */
    const app = __Zn.isInit();
    if (app && app.sigma) {
        // 双字段处理
        data.sigma = app.sigma;
    }
    return __Zn.valueValid(data);
};
export default {
    dataRequest,
    dataIo,
    dataRead,
    dataWrite,
}