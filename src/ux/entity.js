import Abs from './abyss';
import T from './unity';
import E from './error';
import Ele from './element';
import Dev from './develop';
import Cv from './constant';

import moment from "moment";
import {createAction} from 'redux-act';
import {Taper, zero} from "environment";
import {Dsl} from "entity";

const _element = (input, fnExecute) => {
    if (Abs.isFunction(fnExecute)) {
        if (Abs.isArray(input)) {
            // 数组执行每一个元素
            input.forEach((item, index) => {
                if (Abs.isObject(item)) {
                    fnExecute(item, index);
                }
            });
        } else {
            if (Abs.isObject(input)) {
                // 非数组执行当前对象
                fnExecute(input);
            }
        }
    }
};
const _cut = (input, ...attr) => {
    const target = Abs.clone(input);
    const fnCut = (item = {}) => attr.filter(field => item.hasOwnProperty(field))
        .forEach(field => delete item[field]);
    _element(target, fnCut);
};
const _each = (input, fnExecute) => {
    if (input) {
        if (Abs.isArray(input)) {
            input.forEach((item, index) => fnExecute(item, index, input));
        } else if (Abs.isObject(input)) {
            // eslint-disable-next-line
            for (const key in input) {
                if (input.hasOwnProperty(key)) {
                    fnExecute(key, input[key], input);
                }
            }
        }
    }
};
const _matrix = (array = [], object = {}, fnExecute, fnPredicate) => {
    if (!Abs.isEmpty(object)) {
        // 是否检查
        const predicate = Abs.isFunction(fnPredicate) ? fnPredicate : () => true;
        Abs.itFull(array, object, (item = {}, key, value) => {
            if (predicate(value)) {
                fnExecute(item, key, value);
            }
        });
    }
};
const _expand = (item = {}, mapping = {}, overwrite = false) => {
    const object = {};
    Abs.itObject(mapping, (from, to) => {
        // 如果item包含了右边，则直接左边的值的等于右边
        if (item.hasOwnProperty(to)) {
            object[from] = item[to];
        } else if (item.hasOwnProperty(from)) {
            object[to] = item[from];
        }
    });
    return overwrite ? Object.assign(item, object) : Object.assign(object, item);
};
const _to = (value) => {
    if (value) {
        if (Abs.isFunction(value)) {
            const result = value();
            return result ? result : {};
        } else {
            return value;
        }
    } else return {};
};
const _field = (instance, name, value) => {
    if (instance && "string" === typeof name) {
        let $instance = Abs.immutable(instance);
        // 如果value为undefined（2参数，读取）
        if (value) {
            // 【二义性处理】Function和值
            value = _to(value);
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.setIn(path, value);
            } else {
                $instance = $instance.set(name, value);
            }
        } else {
            if (0 <= name.indexOf('.')) {
                const path = name.split('.');
                $instance = $instance.getIn(path);
            } else {
                $instance = $instance.get(name);
            }
        }
        // 返回读取的最终结果
        return Abs.isFunction($instance.toJS) ? $instance.toJS() : $instance;
    }
};

class Uarr {
    constructor(data = []) {
        /*
         * 拷贝节点，原始节点不改变，
         * Stream操作无副作用
         */
        this.data = Abs.clone(data);
    }

    static create(data = []) {
        E.fxTerminal(!Abs.isArray(data), 10057, data);
        if (Abs.isArray(data)) {
            return new Uarr(data);
        }
    }

    matrix(items = {}) {
        _matrix(this.data, items, (item = {}, key, value) => {
            const id = item[key];
            const found = Ele.elementUnique(value, "key", id);
            if (found) {
                item[key] = found;
            }
        }, Abs.isArray);
        return this;
    }

    mount(reference) {
        this.reference = reference;
        return this;
    }

    each(applyFun) {
        _each(this.data, applyFun);
        return this;
    }

    remove(...attr) {
        _cut.apply(this, [this.data].concat(attr));
        return this;
    }

    slice(...keys) {
        const reference = this.data;
        this.data = Abs.slice.apply(this, [reference].concat(keys));
        return this;
    }

    debug() {
        Dev.dgDebug(this.data, "Uarr 调试");
        return this;
    }

    mapping(mapping = {}, override = false) {
        const result = [];
        this.data.forEach(item => result.push(_expand(item, mapping, override)));
        this.data = result;
        return this;
    }

    filter(func) {
        if (Abs.isFunction(func)) this.data = this.data.filter(func);
        return this;
    }

    convert(field, func) {
        if (field && Abs.isFunction(func)) Abs.itElement(this.data, field, func);
        return this;
    }

    add(field, any) {
        if (field) this.data.forEach(item => item[field] = Abs.isFunction(any) ? any(item) : any);
        return this;
    }

    sort(func) {
        if (Abs.isFunction(func)) this.data = this.data.sort(func);
        return this;
    }

    map(func) {
        if (Abs.isFunction(func)) this.data = this.data.map(func);
        return this;
    }

    to() {
        return this.data;
    }

    tree(config = {}) {
        this.data = T.toTree(this.data, config);
        return this;
    }
}

class Uson {
    constructor(data = {}) {
        this.data = Abs.clone(data);
    }

    static create(data = []) {
        E.fxTerminal(!Abs.isObject(data), 10058, data);
        if (Abs.isObject(data)) {
            return new Uson(data);
        }
    }

    mount(reference) {
        this.reference = reference;
        return this;
    }

    each(applyFun) {
        const ref = this.data;
        if (ref) _each(ref, applyFun);
        return this;
    }

    add(field, any) {
        if (any) {
            let values;
            if (Abs.isFunction(any)) {
                values = any(this.reference);
            } else {
                values = any;
            }
            this.data = _field(this.data, field, values);
        }
        return this;
    }

    valid() {
        this.data = Ele.valueValid(this.data);
        return this;
    }

    keep(keys = []) {
        const target = {};
        const reference = this.data;
        keys.forEach(key => {
            const value = reference[key];
            if (undefined !== value) {
                target[key] = value;
            }
        });
        this.data = target;
        return this;
    }

    slice(...keys) {
        this.data = Abs.slice.apply(this, [this.data].concat(keys));
        return this;
    }

    mapping(mapping = {}) {
        this.data = _expand(this.data, mapping);
        return this;
    }

    convert(mapping = {}) {
        const target = {};
        const reference = this.data;
        Abs.itObject(mapping, (from, to) => {
            if (reference.hasOwnProperty(from)) {
                target[to] = reference[from];
            }
        });
        this.data = target;
        return this;
    }

    date(config = {}) {
        const values = this.data;
        Abs.itObject(config, (field, pattern = {}) => {
            if (values.hasOwnProperty(field)) {
                values[field] = moment(values[field], pattern);
            }
        });
        this.data = values;
        return this;
    }

    remove(...fields) {
        _cut.apply(this, [this.data].concat(fields));
        return this;
    }

    execute(executor) {
        if (Abs.isFunction(executor)) {
            this.data = executor(this.data);
        }
        return this;
    }

    debug(flag = "") {
        Dev.dgDebug(this.data, flag);
        return this;
    }

    to() {
        return this.data;
    }
}

/**
 * ## 「标准」`Ux.rxInit`
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
 * @memberOf module:_engine
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} params 参数信息
 */
const rxInit = (reference, params = {}) => {
    const props = reference.props;
    E.fxTerminal(!Abs.isFunction(props.zxInit), 10019, props.zxInit);
    if (Abs.isFunction(props.zxInit)) {
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
                if (Abs.isArray(value)) {
                    if (order) {
                        normalized[newKey] = value.sort(T.sorterAscTFn(order));
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
 * ## 「标准」`Ux.rxDatum`
 *
 * Redux 反向处理器
 *
 * 1. 处理 Tabular
 * 2. 多种 Tabular 时，仅按类别分组处理
 *
 * 用于处理 tabular（`X_TABULAR`）在 redux 层面的状态树专用数据结构。
 *
 * @memberOf module:_engine
 * @param {Array} input 传入的数据源信息。
 * @param {String} orderField 排序专用信息。
 * @param {String} groupField 分组专用信息，如果分组的话执行多个值。
 * @return {Object} 返回最终的数据信息，存储在 `tabular` 节点中。
 */
const rxDatum = (input, orderField = 'sort', groupField = 'type') => {
    let data;
    if (Abs.isArray(input)) {
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
 * ## 「标准」`Ux.rxAssist`
 *
 * Redux 反向处理器，处理 Assist 第三关联表数据。
 *
 * @memberOf module:_engine
 * @param {Array} input 传入的数据源信息。
 * @param {String} key 当前数据绑定的辅助用key。
 * @param {String} order 排序字段。
 * @return {Object} 最终的数据信息，存储在 `assist` 节点中。
 */
const rxAssist = (input, key, order = 'sort') => {
    let data;
    if (Abs.isArray(input)) {
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
/**
 * ## 「特殊」`Ux.rjAssist`
 *
 * Redux 响应处理器，针对Assist数据执行响应处理，专用于Assist辅助数据的响应处理器，必须和 Redux 连用，使用代码如：
 *
 * ```java
 * export default{
 *      ...Ux.rjAssist("today.preorders",
 *          () => Ux.ajaxGet('/api/today/orders/pre')),
 *      ...Ux.rjAssist("today.orders",
 *          () => Ux.ajaxGet("/api/today/orders/all")),
 * }
 * ```
 *
 * 上述代码会生成 Redux 中的 `today.preorders` 和 `today.orders` 两个核心节点，该节点会被 `Ux.onDatum` 调用，
 * 直接调用可以得到 Assist 的核心数据。
 *
 * 最终返回结果：
 *
 * ```json
 * {
 *     ajax: "执行的 Promise",
 *     processor: "响应处理器"
 * }
 * ```
 *
 * @memberOf module:_engine
 * @param {String} key 将要生成的 Assist 辅助数据的键。
 * @param {Promise} ajax 生成远程异步专用的 Promise。
 * @param {String} sortField 最终返回数据的排序字段。
 * @param {boolean} merged 是否执行合并，或者直接返回当前结果。
 * @returns {Object} 返回最终结果。
 */
const rjAssist = (key, ajax, sortField = null, merged = true) => {
    const result = {
        ajax,
        processor: data => rxAssist(data, key, sortField)
    };
    if (merged) {
        /* 用于格式：...处理 */
        const response = {};
        response[key] = result;
        return response;
    } else {
        /* 直接返回某个键的结果 */
        return result;
    }
}
/**
 * ## 「特殊」`Ux.rjTabular`
 *
 * Redux 响应处理器，专用于 Tabular 数据的响应处理流程，后端绑定`X_TABULAR`表，形成最终的
 * 字典类响应数据专用。
 *
 * 最终返回结果：
 *
 * ```json
 * {
 *     ajax: "执行的 Promise",
 *     processor: "响应处理器"
 * }
 * ```
 *
 * @memberOf module:_engine
 * @param {Promise} ajax 生成远程异步专用的 Promise。
 * @param {boolean} merged 是否执行合并，或者直接返回当前结果。
 * @returns {Object} 返回最终结果。
 */
const rjTabular = (ajax, merged = true) => {
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
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    /**
     * ## 「引擎」`Ux.createAction`
     *
     * 创建 redux 中所需要的 Action 信息，内部调用 `redux-act`。
     *
     * @memberOf module:_engine
     * @param {String} path 核心路径信息，不同的 redux 的 Action可以使用不同的值。
     * @return {EmptyActionCreator} 返回创建好的 Action。
     */
    createAction: (path) => createAction(`${Cv.KEY_EVENT}${path}`),
    Uarr,
    Uson,
    /**
     * # 核心注解`@zero`
     *
     * ## 1. 基本介绍
     *
     * zero注解过后执行Hoc高阶封装操作
     *
     * 核心配置类，使用注解语法`@zero`执行资源文件绑定，这个注解在整个框架中为最底层注解，
     * 定义组件本身的元数据，它所处理的工作流程如下：
     *
     * 1. 和 `cab/<LANGUAGE>/` 链接，读取配置信息，构造`HocI18n`对象。
     * 2. redux 映射处理，用于处理 StateToProps 和 DispatchToProps 两种映射关系。
     * 3. 绑定 Ant Design的表单 Form 实现表单的核心绑定。
     * 4. 操作绑定构造 $op 变量，存储在状态中。
     *
     *
     * ```js
     * import Ux from 'ux';
     *
     * &#64;Ux.zero() -- 注释掉的调用方法，由于包含 @ 符号不可解析
     * class Component extends React.Component{
     *
     * }
     * ```
     *
     * ## 2. 代码规范
     *
     * Zero UI中定义了特定的代码规范`src`目录下：
     *
     * |目录|类型|说明|
     * |:---|---|:---|
     * |`cab/<LANGUAGE>`|Json资源|当前页面/容器绑定的资源文件地址。|
     * |container|Js代码|容器组件专用地址。|
     * |components|Js代码|页面组件专用地址。|
     *
     * @method @zero
     */
    zero,
    /**
     * ## 「引擎」`Ux.fnOut`
     *
     * Redux 树的统一处理 reducer 数据。
     *
     * @memberOf module:_engine
     * @method fnOut
     * @param {Object} state 原始状态信息。
     * @param {Object} inState 初始化状态信息。
     */
    fnOut: Taper.fnFlush,
    /**
     * ## 「引擎」`Ux.dataOut`
     *
     * 处理状态专用输出，以下边两种数据结构写入到 Redux 树中。
     *
     * * DataObject：数据单记录模型。
     * * DataArray：数据多记录模型。
     *
     * @memberOf module:_engine
     * @method dataOut
     * @param {Object} data 初始化数据值。
     * @return {Action} 返回 `redux-act` 创建的操作专用。
     */
    dataOut: (data) => Taper.fnFlush(Dsl.createIn(data)),
    /**
     * ## 「引擎」`Ux.dataIn`
     *
     * Redux专用状态树的读取方法，读取数据的调用代码：
     *
     * ```js
     * @Ux.zero(Ux.rxEtat(require('./Cab.json'))
     *      .cab("UI")
     *      .loading("app")
     *      .connect(state => Ux.dataIn(state)
     *          .revamp(["app"])
     *          .to()
     *      )
     *      .connect({
     *          fnApp: Ex.epicApp
     *      }, true)
     *      .to()
     * )
     * ```
     *
     * @memberOf module:_engine
     * @method dataIn
     * @param {Object} state Redux读取到的状态值相关信息，作为输出。
     * @returns {StateOut} 返回状态数据。
     */
    dataIn: (state) => Dsl.createOut(state),
    /**
     * ## 「标准」`Ux.rxEtat`
     *
     * 用于处理专用的资源文件绑定类。
     *
     * 调用代码如：
     *
     * ```js
     * &#64;Ux.zero(Ux.rxEtat(require('../Cab.json'))
     *      .cab("UI.Filter")
     *      .raft(1)
     *      .form().to()
     * )
     * ```
     *
     * @memberOf module:_engine
     * @method rxEtat
     * @returns {RxEtat} 返回最终 @zero 注解中的状态，构造资源文件绑定对象。
     */
    rxEtat: requiredFile => Dsl.rxEtat(requiredFile),
    /**
     * ## 「标准」`Ux.rxFlow`
     *
     * Stream 模式处理 Redux 初始化过程中的数据读取
     *
     * 1. 并且 Ajax
     * 2. 串行 Ajax
     * 3. 读取 Tabular / Assist / Category
     *
     * 内部调用代码：
     *
     * ```js
     * const flow = {
     *      fnInited: Ux.rxFlow(Types.fnInited)
     *          .bind(Ajax)
     *          .mount(
     *              'app',
     *              'app.menus'
     *          )
     *          .to()
     * }
     * ```
     *
     * @memberOf module:_engine
     * @method rxFlow
     * @returns {rxFlow} 返回最终 @zero 注解中的Stream模式的 redux处理器。
     * @deprecated 后期更改掉，取代 rxFlow
     */
    rxFlow: actions => Dsl.rxFlow(actions),

    /*
     * rx / rj
     */
    rxInit,
    rxDatum,
    rxAssist,
    /* Ajax 专用方法用于生成 ajax / processor 结构 */
    rjTabular,
    rjAssist
}