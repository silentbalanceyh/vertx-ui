import Ux from "ux";
import O from "../op";
import moment from "moment";
import B from "./business";

const groupData = (identifier, up = [], down = []) => {
    up = Ux.clone(up);
    down = Ux.clone(down);
    const upGroup = Ux.elementGroup(up.filter(item => identifier === item['targetIdentifier']), "sourceIdentifier");
    const downGroup = Ux.elementGroup(down.filter(item => identifier === item['sourceIdentifier']), "targetIdentifier");
    const groupData = {};
    Object.keys(upGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].up = upGroup[identifier];
    });
    Object.keys(downGroup).forEach(identifier => {
        if (!groupData[identifier]) {
            groupData[identifier] = {};
        }
        groupData[identifier].down = downGroup[identifier];
    });
    return groupData;
};
const groupDefine = (identifier, up = [], down = [], idMap = []) => {
    const groupedData = groupData(identifier, up, down);
    const groupedDefine = {};
    idMap.forEach(identifier => groupedDefine[identifier] = {up: [], down: []});
    Object.assign(groupedDefine, groupedData);
    return groupedDefine;
};

const findFDefine = (reference, identifier, field = "upstream") => {
    const {$definition = []} = reference.props;
    return $definition.filter(item => item[field] === identifier);
};

const findParent = (identifier, category = []) => {
    let current = category.filter(item => identifier === item.identifier);
    if (0 < current.length) {
        /*
         * 丢弃后边的，只保留一个
         */
        current = current[0];
        if (current) {
            const parent = Ux.elementUnique(category, "key", current.parentId);
            if (parent) {
                return parent.identifier;
            }
        }
    }
};

const findFDefinition = (reference, identifier, category = []) => {
    /*
     * 1. 判断 $definition 中是否包含了 fromId
     * upstream = fromId
     */
    const found = findFDefine(reference, identifier);
    if (0 < found.length) {
        /*
         * 找到上级
         */
        return found;
    } else {
        /*
         * 未找到上级，动用父类
         */
        const parentId = findParent(identifier, category);
        if (parentId) {
            return findFDefinition(reference, parentId, category);
        }
    }
};

const findTUnique = (fromRet, identifier, categories = []) => {
    const filtered = fromRet.filter(item => identifier === item['downstream']);
    if (0 < filtered.length) {
        const relation = filtered[0];
        if (relation) {
            return relation.type;
        }
    } else {
        const parentId = findParent(identifier, categories);
        if (parentId) {
            return findTUnique(fromRet, parentId, categories);
        }
    }
};
// =====================================================
// on 前缀
// =====================================================

/**
 *
 * ## 扩展函数
 *
 * 计算关系的 identifier 专用函数，返回的数据结构如：
 *
 * ```json
 * {
 *     "up": [],
 *     "down": []
 * }
 * ```
 *
 * * up: 上游关系数据。
 * * down: 下游关系数据。
 *
 * @memberOf module:_function
 * @method onRelationIdentifiers
 * @param {String} identifier 统一标识符
 * @param {Array} source 关系数据源
 * @param {Array} definition 关系定义数据源
 * @returns {Object} 返回关系数据对象
 */
const onRelationIdentifiers = (identifier, source = [], definition = []) => {
    /*
     * 读取传入的 identifier 的 category key
     */
    const category = source.filter(item => identifier === item.identifier);
    /*
     * 读取 category 对应的所有类、父类、根类信息
     */
    const keys = Ux.treeParentAllIn(category.map(item => item.key), source, "parentId");
    /*
     * [key1, key2, key3] 再次读取所有的 category 对应的 identifier 集合
     */
    const $keys = Ux.immutable(keys);
    const ids = source.filter(item => $keys.contains(item.key)).map(item => item.identifier);
    /*
     * 计算 upIds / downIds
     */
    const $ids = Ux.immutable(ids);
    const upIds = definition.filter(item => $ids.contains(item['downstream'])).map(item => item["upstream"]);
    const downIds = definition.filter(item => $ids.contains(item['upstream'])).map(item => item["downstream"]);
    /*
     * 读取 upKeys / downKeys
     */
    const $upIds = Ux.immutable(upIds);
    const $downIds = Ux.immutable(downIds);
    const upKeys = source.filter(item => $upIds.contains(item.identifier)).map(item => item.key);
    const downKeys = source.filter(item => $downIds.contains(item.identifier)).map(item => item.key);
    /*
     * 读取当前所有keys以及它的子类
     */
    const upAllKeys = Ux.treeChildrenAllIn(upKeys, source, "parentId");
    const downAllKeys = Ux.treeChildrenAllIn(downKeys, source, "parentId");

    const $upAllKeys = Ux.immutable(upAllKeys);
    const $downAllKeys = Ux.immutable(downAllKeys);
    /*
     * 最终计算出来的 identifier
     */
    const identifiers = {up: [], down: []};
    source.filter(item => $upAllKeys.contains(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.up.push(identifier));
    source.filter(item => $downAllKeys.contains(item.key))
        .filter(item => item.leaf).map(item => item.identifier)
        .forEach(identifier => identifiers.down.push(identifier));
    return identifiers;
};
/**
 *
 * ## 扩展函数
 *
 * 计算关系类型专用函数，计算唯一关系信息。
 *
 * @memberOf module:_function
 * @method onRelationType
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} record 当前数据记录
 * @returns {undefined|Object} 返回唯一关系值
 */
const onRelationType = (reference, record = {}) => {
    /*
     * 定义
     */
    const fromId = record.sourceIdentifier;
    const toId = record.targetIdentifier;
    /*
     * category 读取
     */
    const {config = {}} = reference.props;
    if (config.relation) {
        const {source} = config.relation;
        if (source) {
            const categories = Ux.onDatum(reference, source);
            if (0 < categories.length) {
                /*
                 * 使用 fromId 查找
                 */
                const fromRet = findFDefinition(reference, fromId, categories);
                if (fromRet && 0 < fromRet.length) {
                    return findTUnique(fromRet, toId, categories);
                }
            }
        }
    }
}
/**
 * ## 扩展函数
 *
 * 计算关系专用函数。
 *
 * @memberOf module:_function
 * @param {Object} current 当前节点的关系处理
 * @param {Object} config 上下游专用配置处理
 * @param {Object} $defineMap 定义的关系关联数据
 * @returns {Object} 分组过后的关系信息
 */
const onRelation = (current = {}, config = {}, $defineMap) => {
    const {up = [], down = []} = config;
    if ($defineMap) {
        /*
         * 定义分组
         */
        return groupDefine(current.identifier, up, down, $defineMap);
    } else {
        /*
         * 数据分组
         */
        return groupData(current.identifier, up, down);
    }
};
/**
 * ## 扩展函数
 *
 * 使用应用数据初始化，自动加载应用配置数据
 *
 * ```js
 *      let $inited = {};
 *      $inited.type = "ENTITY";
 *      const form = Ex.yoForm(this, null, Ex.onApp($inited));
 * ```
 *
 * @memberOf module:_function
 * @param {Object} $inited 初始化应用数据
 * @returns {Object} 返回最终数据
 */
const onApp = ($inited = {}) => {
    const inited = Ux.clone($inited);
    const app = Ux.isInit();
    if (!$inited.appName) {
        inited.appName = app.name;
    }
    if (!$inited.appName) {
        inited.namespace = toNamespace(app.name);
    }
    if (undefined === $inited.active) {
        inited.active = true;
    }
    return inited;
};
/**
 * ## 扩展函数
 *
 * 树形菜单专用处理函数
 *
 * ```js
 *      const calculated = Ex.onTree(selected, data, {
 *          mode: $selection.mode,
 *          tree: config.tree,
 *      });
 * ```
 *
 * @memberOf module:_function
 * @param {Array} keys 配置数据信息
 * @param {Array} data 树相关数据源
 * @param {Object} config 树相关配置
 * @returns {Array} 返回最终树信息
 */
const onTree = (keys = [], data = [], config = {}) => {
    const source = Ux.toTreeArray(data, config.tree);
    let treeArray = [];
    if (config.mode) {
        const fun = Ux.Tree[config.mode];
        if (Ux.isFunction(fun)) {
            const result = fun(keys, source);
            const $result = Ux.immutable(result);
            treeArray = data.filter(each => $result.contains(each.key));
        }
    }
    return treeArray;
};
// =====================================================
// up前缀
// =====================================================

/**
 * ## 扩展函数
 *
 * 检查输入的 `key` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_function
 * @method upValue
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @param {String} key 状态值
 * @returns {{current, original}}
 */
const _up = (state = {}, prevState = {}, key = "") => {
    if ("string" === typeof key) {
        const original = prevState[key];
        const current = state[key];
        if (Ux.isDiff(original, current)) {
            return {original, current};
        }
    }
};
/**
 * ## 扩展函数
 *
 * 检查 `$condition` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_function
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upCondition = (state = {}, prevState = {}) => _up(state, prevState, "$condition");
/**
 *
 * ## 扩展函数
 *
 * 检查 `$query` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_function
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upQuery = (state = {}, prevState = {}) => _up(state, prevState, '$query');
/**
 *
 * ## 扩展函数
 *
 * 检查 `$loading` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始状态",
 *     current: "新状态"
 * }
 * ```
 *
 * @memberOf module:_function
 * @param {State} state 当前状态
 * @param {State} prevState 之前状态
 * @returns {Object} 返回计算后的状态信息
 */
const upLoading = (state = {}, prevState = {}) => _up(state, prevState, '$loading');
/**
 *
 * ## 扩展函数
 *
 * 检查 `$options, $identifier` 状态信息，计算最终状态值：
 *
 * ```json
 * {
 *     original: "原始属性",
 *     current: "新属性"
 * }
 * ```
 *
 *
 * 移除 component 相关配置信息
 *
 * 1. 解决第一次多选闪屏的问题
 * 2. 在切换页面的过程中，实际上 component 的改动不重要，因为 component 应该在两种情况彻底更改
 *    * $options 发生变更
 *    * $identifier 发生变更
 *
 * 二者是从属关系，所以在 rxPostSelected 触发时，保证不闪屏，所以不检查 component
 *
 * @memberOf module:_function
 * @param {Props} props 当前树形
 * @param {Props} prevProps 之前树形
 * @returns {Object} 返回计算后的状态信息
 */
const upList = (props = {}, prevProps = {}) => {
    const config = props.config;
    const previous = prevProps.config;
    /*
     * 移除 component 相关配置信息
     * 1）解决第一次多选闪屏的问题
     * 2）在切换页面的过程中，实际上 component 的改动不重要，因为 component 应该在两种情况彻底更改
     *    - $options 发生变更
     *    - $identifier 发生变更
     * 二者是从属关系，所以在 rxPostSelected 触发时，保证不闪屏，所以不检查 component
     */
    const current = Ux.clone(config);
    const original = Ux.clone(previous);

    if (current.component) delete current.component;
    if (original.component) delete original.component;

    if (Ux.isDiff(original, current)) {
        return {original, current};
    }
};
// =====================================================
// map前缀
// =====================================================
const _parseClick = (action, reference) => {
    const dataKey = action.onClick;
    if (!Ux.isFunction(dataKey)) {
        /*
         * 从 reference 中提取
         */
        const {$actions = {}} = reference.props;
        const actions = Ux.clone(O);
        Object.assign(actions, $actions);
        /*
         * ACTIONS 处理
         */
        const generator = actions[dataKey];
        if (Ux.isFunction(generator)) {
            const onClick = generator(reference);
            if (Ux.isFunction(onClick)) {
                action.onClick = onClick;
            }
        }
        /*
         * 未注入成功
         */
        if (!Ux.isFunction(action.onClick)) {
            action.onClick = () => {
                console.error("检查配置项：", action, dataKey);
            }
        }
    }
    return action;
};

const _parseAction = (action, reference) => {
    if (action) {
        let button = {};
        if ("string" === typeof action) {
            const actions = {};
            const parsed = action.split(',');
            actions.key = parsed[0];
            actions.id = parsed[0];
            actions.text = parsed[1];
            actions.onClick = parsed[2];
            actions.type = parsed[3] ? parsed[3] : "default";
            if (parsed[4]) {
                actions.icon = parsed[4];
            }
            button = _parseClick(actions, reference);
        } else if (Ux.isObject(action)) {
            button = Ux.clone(action);
        }
        /*
         * 防重复提交加载表单效果处理
         */
        const {$loading = false} = reference.state;
        button.loading = $loading;
        return button;
    }
};
const _parseAuthorized = (action = {}, reference) => {
    if (action) {
        const {$action = {}} = reference.state;
        /*
         * 权限判断
         */
        if ($action.hasOwnProperty(action.key)) {
            if ($action[action.key]) {
                return action;
            }
        } else {
            return action;
        }
    }
};
/**
 * ## 扩展函数
 *
 * 判断哪些函数需要继承：
 *
 * * `rx`前缀函数
 * * `fn`前缀函数
 * * `do`前缀函数
 *
 * @memberOf module:_function
 * @param {String} fnName 函数名称
 * @returns {boolean} 返回判断结果
 */
const mapFun = (fnName) => "string" === typeof fnName && (
    fnName.startsWith('rx') ||  // 触发函数
    fnName.startsWith('fn') ||  // 普通函数
    fnName.startsWith('do')  // 状态函数
);
/**
 * ## 扩展函数
 *
 * 按钮专用处理，用于处理：`optionJsx.extension` 配置的专用扩展函数。
 *
 * @memberOf module:_function
 * @method mapButtons
 * @param {Array} extension 扩展按钮配置
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Array} 返回最终处理配置数据
 */
const mapButtons = (extension = [], reference) => {
    return extension
        .map(each => _parseAction(each, reference))
        .map(each => _parseAuthorized(each, reference))
        .filter(item => !!item);
}

/**
 * ## 扩展配置
 *
 * 处理 `data` 中的 metadata 字段，强制转换成 Json 格式的数据。
 *
 * @memberOf module:_function
 * @param {Object} data 待处理的输入
 * @returns {Object}
 */
const mapMeta = (data = {}) => {
    if ("string" === typeof data.metadata) {
        data.metadata = Ux.toJson(data.metadata);
    }
    return data;
};
/**
 * ## 扩展配置
 *
 * 处理 `item` 中的 `uri` 地址，主要用于处理 `EXPAND` 类型的菜单路径专用。
 *
 * @memberOf module:_function
 * @param {Object} item 配置对象信息
 * @param {DataObject} $app 应用对象数据
 * @returns {Object} 处理过后的对象数据
 */
const mapUri = (item = {}, $app) => {
    if (item.uri) {
        if ("EXPAND" !== item.uri) {
            item.uri = toUri(item.uri, $app);
        } else {
            item.uri = undefined;
        }
    }
    return item;
};
/**
 * ## 扩展配置
 *
 * 处理 ASSIST 专用配置数据：
 *
 * * DATUM：`$render`专用处理。
 * * DATE：`$render`专用处理。
 *
 * @memberOf module:_function
 * @param {Array} columns 基本类配置信息
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Promise.<T>} Promise 专用配置处理
 */
const mapAsyncDatum = (columns = [], reference) => {
    const datum = {};
    columns.filter(column => column.hasOwnProperty("$render")).forEach(column => {
        const name = column.dataIndex;
        const render = column['$render'];
        if ("DATUM" === render) {
            const normalized = Ux.Ant.toUnique(reference, column);
            /*
             * 转换成：value = display 的格式
             */
            const {data = [], config = {}} = normalized;
            const {display, value} = config;
            if (display && value) {
                const datumData = {};
                data.filter(record => !!record[value])
                    .filter(record => !!record[display])
                    .forEach(record => datumData[record[value]] = record[display]);
                if (!Ux.isEmpty(datumData)) {
                    datum[name] = datumData;
                }
            }
        } else if ("DATE" === render) {
            datum[name] = (data) => {
                if (data) {
                    const {$format = ""} = column;
                    const output = Ux.valueTime(data);
                    if (moment.isMoment(output)) {
                        /*
                         * 时间格式转换值
                         */
                        return output.format($format);
                    }
                }
                return data;
            };
        }
    });
    return Ux.promise(datum);
};
// =====================================================
// to前缀
// =====================================================
/**
 * ## 扩展配置
 *
 * Uri专用配置处理，构造路径信息。
 *
 * @memberOf module:_function
 * @param {String} uri 原始路径信息
 * @param {DataObject} $app 应用程序对象
 * @returns {string} 返回最终的Uri信息
 */
const toUri = (uri = "", $app) => {
    let path;
    if ($app) {
        path = $app._("path") ? $app._("path") : Ux.Env['ROUTE'];
    } else {
        path = Ux.Env['ROUTE'];
    }
    let relatedPath = `${path}${uri}`;
    if (!relatedPath.startsWith('/')) {
        relatedPath = `/${relatedPath}`;
    }
    return relatedPath;
};
/**
 * ## 扩展函数
 *
 * 窗口配置生成函数
 *
 * @memberOf module:_function
 * @param {Object} dialog 窗口专用配置
 * @returns {Object} 处理后的配置
 */
const toDialog = (dialog) => {
    const config = {};
    if (dialog) {
        if (Ux.isObject(dialog)) {
            Object.assign(config, Ux.clone(dialog));
        } else if ("string" === typeof dialog) {
            Object.assign(config, {content: dialog});
        }
    }
    return config;
};
/**
 * ## 扩展函数
 *
 * 名空间计算
 *
 * 1. 传入是 string， 直接来
 * 2. 传入是 非 string，走 React
 *
 * @memberOf module:_function
 * @param {ReactComponent} reference React对应组件引用
 * @returns {string|undefined} 返回合法名空间
 */
const toNamespace = (reference) => {
    if ("string" === typeof reference) {
        return `cn.originx.${reference}`;
    } else {
        const {$app} = reference.props;
        if ($app && $app.is()) {
            const name = $app._('name');
            if (name && "string" === typeof name) {
                return toNamespace(name);
            } else {
                console.error("[ Ex ] 应用数据有问题！", $app.to());
            }
        } else {
            console.error("[ Ex ] 未捕捉到应用信息！", reference.props);
        }
    }
};

const COLORS = [
    "#48aaf7",
    "#d00036",
    "#44bc78",
    "#030f1f",
    "#e79627",
    "#7d4ab8",
    "#70d5fe",
    "#7077eb"
];
/**
 * ## 扩展函数
 *
 * 1. 如果传入 current，则读取 current 上的颜色信息。
 * 2. 如果不传入 current，则随机读取颜色信息。
 *
 * @memberOf module:_function
 * @param {Number} current 索引数据
 * @returns {WebColor} 返回颜色值
 */
const toColor = (current) => {
    if (undefined === current) {
        const index = Ux.randomInteger(0, COLORS.length);
        return COLORS[index];
    } else {
        const index = current % COLORS.length;
        return COLORS[index];
    }
};
/**
 * ## 扩展函数
 *
 * 从 `module` 中提取配置信息，并执行 identifier 的计算。
 *
 * @memberOf module:_function
 * @param {ReactComponent} reference React对应组件引用
 * @param {String} field 字段信息
 * @returns {String} 返回最终的模型ID（统一标识符计算值）
 */
const toModelId = (reference, field) => {
    const inited = Ux.ambObject(reference, "$inited");
    const module = Ux.fromHoc(reference, "module");
    if (module[field]) {
        const config = module[field];
        return toIdentifier(config, inited['modelId']);
    }
};
/**
 * ## 扩展函数
 *
 * 根据传入配置计算统一标识符
 *
 * 1. `__DEFAULT__`：默认的统一标识符，如果不存在则使用该值。
 * 2. `__PATTERN__`：执行 format 专用表达式解析转换。
 *
 * @memberOf module:_function
 * @param {Object} config 基本配置信息
 * @param {Object} program 编程专用配置信息
 * @returns {String} 返回最终的统一标识符
 */
const toIdentifier = (config = {}, program) => {
    if (Ux.isEmpty(config)) {
        throw new Error(" config 在解析 modelId 的时候不可为空，请检查！")
    } else {
        const defaultValue = config.__DEFAULT__ ? config.__DEFAULT__ : "__DEFAULT__";
        const identifier = program ? program : defaultValue;
        if (config.hasOwnProperty('__PATTERN__')) {
            const expr = config.__PATTERN__;
            return Ux.formatExpr(expr, {identifier});
        } else {
            return config[identifier];
        }
    }
};

/**
 * ## 扩展函数
 *
 * DataArray和Array的统一数据处理，返回最终的 Array 数组。
 *
 * @memberOf module:_function
 * @param {any} data 输入数据
 * @returns {Array} 最终返回数组
 */
const toArray = (data) => {
    if (data && Ux.isFunction(data.to)) {
        /*
         * Data Array
         */
        const $data = data.to();
        if (Ux.isArray($data)) {
            return Ux.clone($data);
        } else {
            return [];
        }
    } else {
        /*
         * JavaScript Array
         */
        if (Ux.isArray(data)) {
            return Ux.clone(data);
        } else {
            return [];
        }
    }
};
/*
 * 注意这里全部要使用三阶函数
 */
const FUNS = {
    "event.filter": () => reference => params =>
        B.form(reference).filter(params),
    "event.add": (config = {}) => reference => params =>
        B.form(reference).add(params, config),
    "event.save": (config = {}) => reference => params =>
        B.form(reference).save(params, config),
    "event.delete": (config = {}) => reference => params =>
        B.form(reference).remove(params, config)
};
/**
 * ## 扩展函数
 *
 * 生成操作类专用函数执行器执行绑定。
 *
 * @memberOf module:_function
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} metadata 元数据配置信息
 * @returns {Function} 返回事件函数
 */
const onOp = (reference, metadata = {}) => {
    const {event = "", config = {}} = metadata;
    const executor = FUNS[event];
    if (Ux.isFunction(executor)) {
        return executor(config);
    } else {
        console.error("[ Ex ] 对不起，事件无法绑定！", event);
    }
};
export default {
    // to 处理
    toArray,
    toUri,
    toDialog,
    toNamespace,
    toColor,
    toModelId,
    toIdentifier,
    // map 处理
    mapFun,
    mapUri,
    mapMeta,
    mapButtons,
    mapAsyncDatum,
    // up 前缀
    upCondition,
    upQuery,
    upValue: _up,
    upList,
    upLoading,
    // on 前缀
    onApp,
    onTree,
    onRelation,
    onRelationIdentifiers,
    onRelationType,
    onOp,
}