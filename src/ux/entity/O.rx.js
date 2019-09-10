import E from '../error';
import U from 'underscore';
import Abs from '../abyss';

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
                const newKey = `${prefix}.${key.replace(/\./g, '_')}`
                const value = Abs.clone(data[key]);
                if (U.isArray(value)) {
                    normalized[newKey] = value
                    /* 固定顺序处理 */
                        .sort((left, right) => left[order] - right[order]);
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
const rxDatum = (input, order = 'sort') => {
    let data = null;
    if (U.isArray(input)) {
        /*
         * 直接修改，data 为数组，按 type 执行 group by
         */
        let $array = Abs.immutable(input);
        $array = $array.groupBy(item => item.get('type'));
        data = $array.toJS();
    } else {
        data = Abs.clone(input);
    }
    return rxPrefix(data, 'tabular', order);
};
const rxAssist = (input, key, order = 'sort') => {
    let data = null;
    if (!U.isArray(input)) {
        if (input.list) {
            data = Abs.clone(input.list);
        } else {
            data = [];
        }
    }
    return rxPrefix(data, 'assist', order);
};
export default {
    rxInit,
    rxDatum,
    rxAssist
}