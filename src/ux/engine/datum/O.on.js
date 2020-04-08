import fromDatum from './O.from.datum';
import U from 'underscore';
import Abs from '../../abyss';
import {Dsl} from "entity";

/**
 * ## 引擎函数
 *
 * 辅助数据读取专用函数，可根据 key = `xxx.yyy` 的值处理辅助数据，主要读取：
 *
 * 1. 读取Tabular专用辅助数据。
 * 2. 读取Assist专用辅助数据。
 * 3. 读取Category专用辅助数据。
 *
 * 根据所需信息读取上述三大类的辅助数据，得到最终的 Array 类型的数组结果。
 *
 * @memberOf module:_on
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 需要读取的 Tabular/Assist 的键值。
 * @return {Array} 返回最终的数组。
 */
const onDatum = (reference, key) => {
    if (key && "string" === typeof key) {
        const data = fromDatum(reference, key);
        const dataArray = (data && data.is()) ? data.to() : [];
        return U.isArray(dataArray) ? dataArray : [];
    } else {
        console.warn("[ Ux ] 传入的 `key` 值不对", key);
        return [];
    }
};
/**
 * ## 引擎函数
 *
 * 直接返回属性中的`reference`（父类引用），根据`current`计算将要递归的层级，这里必须是
 * 按照 Zero UI 中的规范传入了 reference 的组件。
 *
 * ```js
 * // 父类引用
 * const ref = Ux.onReference(this, 1);
 *
 * // 爷类引用
 * const ref - Ux.onReference(this, 2);
 *
 * // 不断往上递归，读取所需要的 n 层引用信息。
 * ```
 *
 * @memberOf module:_on
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Number} current 处理层级信息。
 * @return {ReactComponent} 返回组件引用。
 */
const onReference = (reference, current = 0) => {
    let ref = reference;
    let counter = 0;
    while (counter < current) {
        // 读取当前引用的props
        const props = ref.props;
        if (props) {
            ref = props.reference;
        }
        counter++;
    }
    return ref;
};

/**
 * ## 引擎函数
 *
 * 从React Router中读取路由参数的值相关信息，该路由参数包括
 *
 * 1. 路径参数，在路由中使用`/ox/person/:ci`类似的`ci`参数。
 * 2. 查询请求参数，路由中的`/ox/person?a=x&b=y`中的`a、b`参数。
 *
 * @memberOf module:_on
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 读取参数的参数名。
 * @return {*}
 */
const onRouter = (reference, key) => {
    const {$router} = reference.props;
    if ($router) {
        const params = $router.params();
        if (params) {
            return params[key];
        }
    }
};
/**
 * ## 引擎函数
 *
 * 和 linker 配置项目的数据提取。
 *
 * @memberOf module:_on
 * @param {Object} config linker相关的配置信息。
 * @param {Function|any} valueSupplier 默认值，或值处理函数。
 * @return {Object} 生成的最终 linker 数据。
 */
const onLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker) && U.isFunction(valueSupplier)) {
        const fields = Object.keys(linker)
            .map(field => linker[field])
            .filter(field => !!field);
        const sourceValues = valueSupplier(fields);
        if (!Abs.isEmpty(sourceValues)) {
            Object.keys(sourceValues).forEach(formField => Object.keys(linker)
                .filter(linkerField => formField === linker[linkerField])
                .forEach(linkerField => {
                    values[linkerField] = sourceValues[formField];
                }));
        }
    }
    return values;
};
/**
 * ## 引擎函数
 *
 * 1. 数组合并（添加、更新）处理。
 * 2. 数组删除。
 *
 * @memberOf module:_on
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 需要读取的 Tabular/Assist 的键值。
 * @param {Object} data 数据处理信息，包含了数据记录集。
 * @param {boolean} isDeleted 删除还是合并。
 * @return {Array} 返回处理完成的数组信息。
 */
const onSave = (reference, key, data, isDeleted = false) => {
    if (key) {
        const dataArray = onDatum(reference, key);
        if (dataArray) {
            const $data = Dsl.getArray(dataArray);
            if (isDeleted) {
                $data.removeElement(data.key);
            } else {
                $data.saveElement(data);
            }
            return $data.to();
        }
    }
};
export default {
    onSave,         // 处理 Assist / Tabular 的合并
    onDatum,        // 读取 Tabular 或 Assist
    onReference,    // 读取上层引用
    onRouter,       // 读取路由中的参数
    onLinker,       // 根据 linker 读取数据信息
}