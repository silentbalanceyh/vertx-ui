import E from '../error';
import U from 'underscore';
import Abs from '../abyss';
import Ut from '../unity';

const rxInit = (reference, params = {}) => {
    const props = reference.props;
    E.fxTerminal(!U.isFunction(props.zxInit), 10019, props.zxInit);
    if (U.isFunction(props.zxInit)) {
        const {$router} = props;
        let paramData = {};
        if ($router) {
            Object.assign(paramData, $router.params());
        }
        Object.assign(paramData, params);
        // 特殊引入的注入
        paramData.reference = reference;
        props.zxInit(paramData);
    }
};
const rxPrefix = (data = {}, prefix = "", order = "sort") => {
    if (prefix && !Abs.isEmpty(data)) {
        const normalized = {};
        // eslint-disable-next-line
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const newKey = `${prefix}.${key.replace(/\./g, '_')}`;
                const value = Abs.clone(data[key]);
                if (U.isArray(value)) {
                    if (order) {
                        normalized[newKey] = value.sort(Ut.sorterAscTFn(order));
                    } else {
                        normalized[newKey] = value;
                    }
                }
            }
        }
        return normalized;
    } else {
        return Abs.clone(data);
    }
};
/*
 * Redux 反向处理器
 * 1）处理 Tabular
 * 2）多种 Tabular 时，仅按类别分组处理
 */
const rxDatum = (input, orderField = 'sort', groupField = 'type') => {
    let data = null;
    if (U.isArray(input)) {
        /*
         * 直接修改，data 为数组，按 type 执行 group by
         */
        let $array = Abs.immutable(input);
        $array = $array.groupBy(item => item.get(groupField));
        data = $array.toJS();
    } else {
        data = Abs.clone(input);
    }
    return rxPrefix(data, 'tabular', orderField);
};
const rxAssist = (input, key, order = 'sort') => {
    let data = null;
    if (U.isArray(input)) {
        data = Abs.clone(input);
    } else {
        if (input.list) {
            data = Abs.clone(input.list);
        } else {
            data = [];
        }
    }
    const response = {};
    response[key] = data;
    return rxPrefix(response, 'assist', order);
};
export default {
    rxInit,
    rxDatum,
    rxAssist,
    /*
     * Ajax 专用方法用于生成 ajax, processor 结构
     */
    rjAssist: (key, ajax, sortField = null, merged = true) => {
        const result = {
            ajax,
            processor: data => rxAssist(data, key, sortField)
        };
        if (merged) {
            /*
             * 用于格式：...处理
             */
            const response = {};
            response[key] = result;
            return response;
        } else {
            /*
             * 直接返回某个键的结果
             */
            return result;
        }
    },
    rjTabular: (ajax, merged = true) => {
        const result = {
            ajax,
            processor: rxDatum,
        };
        if (merged) {
            const response = {};
            response.tabular = result;
            return response;
        } else {
            return result;
        }
    }
}