import E from '../error';
import Abs from '../abyss';
import Ele from '../element';
import T from '../unity';
import {Dsl} from "entity";

const yoDatum = (props = {}, keys = []) => {
    const inherits = {};
    if (0 === keys.length) {
        // 读取所有
        // eslint-disable-next-line
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                if (key.startsWith("$t_") || key.startsWith("$a_")) {
                    inherits[key] = props[key];
                }
            }
        }
    } else {
        keys.forEach(key => {
            key = key.replace(/\./g, '_');
            if (props[`$t_${key}`]) {
                inherits[`$t_${key}`] = props[`$t_${key}`];
            } else if (props[`$a_${key}`]) {
                inherits[`$a_${key}`] = props[`$a_${key}`];
            }
        });
    }
    return inherits;
};

const onProp = (props = {}, ...keys) => {
    const inherits = {};
    // Fix Issue
    let targetFor = [];
    if (1 === keys.length && Array.prototype.isPrototypeOf(keys[0])) {
        targetFor = keys[0];
    } else {
        targetFor = keys;
    }
    targetFor.forEach(key => {
        const targetKey = `$${key}`;
        if (props.hasOwnProperty(targetKey)) {
            inherits[targetKey] = props[targetKey];
        }
    });
    // 特殊方法专用：reference和fnOut
    // fnOut：专用写Redux状态的方法
    if (props.fnOut) {
        inherits.fnOut = props.fnOut;
    }
    return inherits;
};
/**
 * ## 「引擎」`Ux.onUniform`
 *
 * 原生 Zero UI中的组件继承属性专用方法，在 Zero Extension 中会调用`yoAmbient`方法实现属性继承，
 * 继承过程中包含几个核心数据：
 *
 * 1. `$t_` 和 `$a_` 的辅助数据，Tabular和Assist两种。
 * 2. `app`应用程序相关数据。
 * 3. `user, profile`用户登录后的数据。
 * 4. `submitting`防重复提交状态数据。
 * 5. `router`核心路由数据。
 * 6. 输入的`keys`对应的键相关数据。
 *
 * @memberOf module:_ui
 * @param {Props} props 当前React组件的属性信息。
 * @param {String[]} keys 待提取的属性集合。
 * @return {Object} 返回最终的数据信息。
 */
const onUniform = (props, ...keys) => {
    const item = yoDatum(props);
    const defaultProp = [
        "app",      // 应用程序数据
        "user",     // 用户数据
        "profile",  // 账号数据
        "router",   // 路由数据
        "parent",   // 主记录数据
        "submitting"    // 防重复提交专用
    ].concat(keys);
    const common = onProp.apply(this, [props].concat(defaultProp));
    return {
        ...item,
        ...common
    };
};


/**
 * ## 「引擎」`Ux.fromHoc`
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 读取对应属性名。
 * @return {null}
 */
const fromHoc = (reference = {}, key = "") => {
    E.fxTerminal("string" !== typeof key, 10000, "string", typeof key);
    if (reference) {
        const {$hoc} = reference.state ? reference.state : {};
        return ($hoc) ? $hoc._(key) : null;
    } else {
        console.error("传入第一个参数 reference 为 null 或 undefined");
    }
};
/**
 * ## 「引擎」`Ux.fromPath`
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息，可以处理深度路径信息。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String[]} args 读取属性名核心路径。
 * @return {null}
 */
const fromPath = (reference = {}, ...args) => {
    let keys = Ele.ambArray.apply(this, args);
    const length = keys['length'];
    E.fxTerminal(1 > length, 10070, keys, 1);
    let data = fromHoc(reference, keys[0]);
    if (1 < length && data) {
        const path = [];
        [].concat(keys).forEach((item, index) => {
            if (0 < index) {
                path.push(item);
            }
        });
        const $data = Abs.immutable(data);
        data = $data.getIn(path);
        if (data && data.toJS) {
            data = data.toJS();
        }
    }
    return data;
};

const _parseDatum = (target, key) => {
    const targetKey = target[`$t_${key}`] || target[`$a_${key}`];
    if (targetKey) {
        if (targetKey.is()) {
            return targetKey;
        } else {
            return targetKey;
        }
    }
};
const _fromDatum = (reference, key) => {
    if (reference.state) {
        const parsed = _parseDatum(reference.state, key);
        if (parsed) {
            return parsed;
        }
    }
};
const fromDatum = (reference, key) => {
    key = key.replace(/\./g, "_");
    /*
     * 先从 props 中读取
     */
    let parsed;
    if (reference.props) {
        parsed = _parseDatum(reference.props, key);
        if (!parsed) {
            parsed = _fromDatum(reference, key);
        }
    } else {
        parsed = _fromDatum(reference, key);
    }
    if (parsed) {
        return parsed;
    } else {
        return Dsl.getArray(undefined);
    }
};

/**
 * ## 「标准」`Ux.onDatum`
 *
 * 辅助数据读取专用函数，可根据 key = `xxx.yyy` 的值处理辅助数据，主要读取：
 *
 * 1. 读取Tabular专用辅助数据。
 * 2. 读取Assist专用辅助数据。
 * 3. 读取Category专用辅助数据。
 *
 * 根据所需信息读取上述三大类的辅助数据，得到最终的 Array 类型的数组结果。
 *
 * @memberOf module:_ui
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 需要读取的 Tabular/Assist 的键值。
 * @return {Array} 返回最终的数组。
 */
const onDatum = (reference, key) => {
    if (key && "string" === typeof key) {
        const data = fromDatum(reference, key);
        const dataArray = (data && data.is()) ? data.to() : [];
        return Abs.isArray(dataArray) ? dataArray : [];
    } else {
        console.warn("[ Ux ] 传入的 `key` 值不对", key);
        return [];
    }
};
/**
 * ## 「引擎」`Ux.onReference`
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
 * @memberOf module:_ui
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
 * ## 「引擎」`Ux.onRouter`
 *
 * 从React Router中读取路由参数的值相关信息，该路由参数包括
 *
 * 1. 路径参数，在路由中使用`/ox/person/:ci`类似的`ci`参数。
 * 2. 查询请求参数，路由中的`/ox/person?a=x&b=y`中的`a、b`参数。
 *
 * @memberOf module:_ui
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
 * ## 「标准」`Ux.onLinker`
 *
 * 和 linker 配置项目的数据提取。
 *
 * @memberOf module:_ui
 * @param {Object} config linker相关的配置信息。
 * @param {Function|any} valueSupplier 默认值，或值处理函数。
 * @return {Object} 生成的最终 linker 数据。
 */
const onLinker = (config = {}, valueSupplier) => {
    const values = {};
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker) && Abs.isFunction(valueSupplier)) {
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
 * ## 「标准」`Ux.onSave`
 *
 * 1. 数组合并（添加、更新）处理。
 * 2. 数组删除。
 *
 * @memberOf module:_ui
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
/**
 * ## 「标准」`Ux.assistIn`
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React组件。
 * @param {String} key 需要读取的 Assist 的键值。
 * @param {Object} data 需要执行数据处理的信息
 */
const assistIn = (reference, key, data) => {
    const combine = onSave(reference, key, data);
    if (combine) {
        const state = {};
        state[`assist.${key}`] = combine;
        T.writeTree(reference, state);
    }
}
/**
 * ## 「标准」`Ux.assistOut`
 *
 * @param {ReactComponent} reference React组件。
 * @param {String} key 需要读取的 Assist 的键值。
 * @param {Object} data 需要执行数据处理的信息
 */
const assistOut = (reference, key, data) => {
    const combine = onSave(reference, key, data, true);
    if (combine) {
        const state = {};
        state[`assist.${key}`] = combine;
        T.writeTree(reference, state);
    }
}
export default {
    assistIn,
    assistOut,
    onUniform,
    onSave,         // 处理 Assist / Tabular 的合并
    onDatum,        // 读取 Tabular 或 Assist
    onReference,    // 读取上层引用
    onRouter,       // 读取路由中的参数
    onLinker,       // 根据 linker 读取数据信息

    fromHoc,
    fromPath,

    /**
     * ## 「引擎」`Ux.elementFindDatum`
     *
     * 带辅助数据的强化版`elementFind`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {Object} filters 查询条件。
     * @return {Array} 返回查找的数组。
     */
    elementFindDatum: (reference, source, filters) =>
        Ele.elementFind(onDatum(reference, source), filters),
    /**
     * ## 「引擎」`Ux.elementUniqueDatum`
     *
     * 带辅助数据的强化版`elementUnique`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 查询专用字段。
     * @param {any} value 查询字段对应的值。
     * @return {Object|null} 返回查找到的唯一记录数据。
     */
    elementUniqueDatum: (reference, source, field, value) =>
        Ele.elementUnique(onDatum(reference, source), field, value),
    /**
     * ## 「引擎」`Ux.elementGroupDatum`
     *
     * 带辅助数据的强化班`elementGroup`方法。
     *
     * @memberOf module:_element
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 分组专用的字段名。
     * @return {Object} 分组过后的数据。
     */
    elementGroupDatum: (reference, source, field) =>
        Ele.elementGroup(onDatum(reference, source), field)
}