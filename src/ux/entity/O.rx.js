import E from '../error';
import U from 'underscore';
import Abs from '../abyss';
import Ut from '../unity';

/**
 * ## 特殊函数「Zero」
 *
 * 最早的特殊初始化函数，在 redux 流程中会使用到该函数，最早的框架内部有一个 zxInit 的 redux 函数，
 * 该函数存在于 dispatch 到 props 中，该函数 zxInit 会执行带参数的操作。
 *
 * 参数会包含两部分：
 *
 * 1. 编程传入的参数信息。
 * 2. react-router 中的路由信息，调用 `$router.params` 方法的结果。
 * 3. 参数中会引入 reference 将当前组件引用传入。
 *
 * 最终调用 zxInit，如果没有这个函数则此Api 不可以调用。
 *
 * @deprecated 有可能将来被废弃，替换的使用 Zero Extension 模块处理。
 * @memberOf module:_rx
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} params 参数信息
 */
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
/**
 * ## 标准函数「Zero」
 *
 * Redux 反向处理器
 *
 * 1. 处理 Tabular
 * 2. 多种 Tabular 时，仅按类别分组处理
 *
 * 用于处理 tabular（`X_TABULAR`）在 redux 层面的状态树专用数据结构。
 *
 * @memberOf module:_rx
 * @param {Array} input 传入的数据源信息。
 * @param {String} orderField 排序专用信息。
 * @param {String} groupField 分组专用信息，如果分组的话执行多个值。
 * @return {Object} 返回最终的数据信息，存储在 `tabular` 节点中。
 */
const rxDatum = (input, orderField = 'sort', groupField = 'type') => {
    let data;
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
/**
 * ## 标准函数「Zero」
 *
 * Redux 反向处理器，处理 Assist 第三关联表数据。
 *
 * @memberOf module:_rx
 * @param {Array} input 传入的数据源信息。
 * @param {String} key 当前数据绑定的辅助用key。
 * @param {String} order 排序字段。
 * @return {Object} 最终的数据信息，存储在 `assist` 节点中。
 */
const rxAssist = (input, key, order = 'sort') => {
    let data;
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
}