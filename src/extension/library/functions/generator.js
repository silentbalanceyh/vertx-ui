import Ux from "ux";
import Fn from "./func";
import G from "./global";
import {Dsl} from 'entity';

const Mode = G.Mode;
const Opt = G.Opt;

const switcher = (reference, name, supplier) => {
    if ("string" === typeof name && name.startsWith("rx")) {
        const fun = reference.props[name];
        /*
         * 注意参数本身使用了拷贝，目的是防止：
         * 1）props 过来的参数本来不可变更
         * 2）state 过来的参数可以更改，由于是 Object 内部改动，不会触发 re-render，所以禁止更改
         */
        if (Ux.isFunction(fun)) {
            return (params = {}) => fun(Ux.clone(params));
        } else {
            return (params = {}) => supplier(Ux.clone(params));
        }
    } else {
        throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `rx` 前缀！");
    }
};
/*
 * 核心状态管理
 */
const boolean = (reference, key, value = true) => (event) => {
    const addOn = Ux.prevent(event);
    const state = {};
    state[key] = value;
    Object.assign(state, addOn);
    reference.setState(state);
};

const seek = (reference, fnName, config = {}) => (args) => {
    const {
        inState = false,
        inError = true
    } = config;
    if (reference) {
        if (Fn.mapFun(fnName)) {
            /* 参数规范化 */
            args = (args && Ux.isArray(args)) ? args : [];
            /* 优先从 props 中读取 函数 */
            let fun = reference.props[fnName];
            if (Ux.isFunction(fun)) {
                return fun.apply(this, [].concat(args));
            } else {
                if (inState) {
                    /* 没找到的情况，直接从 state 中读取 */
                    fun = reference.state[fnName];
                    if (Ux.isFunction(fun)) {
                        /* 补充当前状态改变 */
                        return fun.apply(this, [].concat(args));
                    } else {
                        const message = `[ Ex ] ${fnName} 函数出错！`;
                        if (inError) {
                            throw new Error(message);
                        }
                    }
                } else {
                    const message = `[ Ex ] ${fnName} 函数未出现在 props 中！`;
                    if (inError) {
                        throw new Error(message);
                    }
                }
            }
        } else {
            throw new Error("[ Ex ] 为兼容 Ux 组件，传入的函数名必须 `fn` 前缀或 `rx` 前缀！");
        }
    } else {
        throw new Error("[ Ex ] 空 reference 引用！");
    }
};
const Cm = {
    switcher,
    /* 内部调用 */
    boolean,
    seek,
}
const ARGS = {
    inError: false
};


const _createTab = (reference, view, supplier) => {
    if (Ux.isFunction(supplier)) {
        let {tabs = {}} = reference.state;
        tabs = Ux.clone(tabs);
        const type = tabs.items.filter(item => view === item.type);
        if (0 < type.length) {
            tabs.activeKey = type[0].key;
        } else {
            const tab = supplier(tabs);
            tabs.items.push(tab);
            tabs.activeKey = tab.key;
        }
        return tabs;
    } else {
        throw new Error("[Ex] 构造 Tab 页面的 supplier 不是一个合法函数");
    }
};

const addTab = (reference) => {
    let {options = {}} = reference.state;
    return _createTab(reference, Mode.ADD, (tabs) => ({
        key: Ux.randomUUID(),
        tab: options[Opt.TABS_ADD],
        type: Mode.ADD,
        index: tabs.items.length
    }));
};
const editTab = (reference, data = {}) => {
    let {options = {}} = reference.state;
    return _createTab(reference, Mode.EDIT, (tabs) => ({
        key: data.key,
        tab: options[Opt.TABS_EDIT],
        type: Mode.EDIT,
        index: tabs.items.length
    }));
};
const closeTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.items = tabs.items.filter(each => each.key !== key);
    tabs.items.forEach((each, index) => each.index = index);
    tabs.activeKey = tabs.items[0].key;
    // 计算 view
    const view = viewSwitch(reference, Mode.LIST, undefined);
    return {tabs, ...view};
};
const clickTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.activeKey = key;
    // 右边按钮计算
    const item = tabs.items.filter(item => item.key === key)[0];
    const view = viewSwitch(reference, item.type, key);
    return {tabs, ...view};
};
const removeTab = (reference, key) => {
    let {tabs = {}} = reference.state;
    tabs = Ux.clone(tabs);
    let view = {};
    let item = tabs.items.filter(item => key === item.key)[0];
    if (item) {
        const index = item.index - 1;
        if (2 < tabs.items.length) {
            const activeItem = tabs.items.filter(item => item.index === index)[0];
            tabs.activeKey = activeItem.key;
            tabs.items = tabs.items.filter(item => key !== item.key);
            if (0 === activeItem.index) {
                view = viewSwitch(reference, Mode.LIST, undefined);
            } else {
                view = viewSwitch(reference, Mode.EDIT, activeItem.key);
            }
        } else {
            tabs.activeKey = tabs.items[0].key;
            tabs.items = [tabs.items[0]];
            view = viewSwitch(reference, Mode.LIST, undefined);
        }
        tabs.items.forEach((item, index) => {
            item.index = index;
        });
        /*
         * 关闭窗口时需设置
         * $inited = {}（防止编辑表单混用）
         */
        return {tabs, ...view, $inited: {}};
    } else {
        console.error("请检查响应数据，key 值不对应：", key, tabs.items)
    }
};
const saveTab = (reference, data, item) => {
    // 删除
    let {tabs = {}, options = {}} = reference.state;
    tabs = Ux.clone(tabs);
    tabs.items = tabs.items.filter(each => each.key !== item.key);
    // 添加新的
    const tab = {
        key: data.key,
        tab: options[Opt.TABS_EDIT],
        type: Mode.EDIT,   // 类型
        index: tabs.items.length
    };
    tabs.items.push(tab);
    tabs.activeKey = data.key;
    return tabs;
};
const viewSwitch = (reference, $view = Mode.LIST, $key) => {
    const {rxViewSwitch} = reference.props;
    if (Ux.isFunction(rxViewSwitch)) {
        rxViewSwitch($view, $key);
    }
    return {$view, $key};
};

/**
 * @class View
 * @private
 */
class View {
    /**
     * 切换视图专用方法
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} $view 视图状态`list, add, edit`
     * @param {String} $key 处理专用key 值
     * @returns {Object} 执行
     */
    static switch(reference, $view = Mode.LIST, $key) {
        return viewSwitch(reference, $view, $key);
    }
}

/**
 * 返回状态信息：
 *
 * ```json
 * {
 *     tabs: {},
 *     $key: "",
 *     $view: ""
 * }
 * ```
 *
 * @class Tab
 * @private
 */
class Tab {
    /**
     * 添加Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Object} 返回最终状态
     */
    static add(reference) {
        return addTab(reference);
    }

    /**
     * 编辑Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} data 当前数据记录
     * @returns {Object} 返回最终状态
     */
    static edit(reference, data = {}) {
        return editTab(reference, data);
    }

    /**
     * 关闭Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static close(reference, key) {
        return closeTab(reference, key);
    }

    /**
     * 点击Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static click(reference, key) {
        return clickTab(reference, key);
    }

    /**
     * 移除Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {String} key 当前 active 的键值
     * @returns {Object} 返回最终状态
     */
    static remove(reference, key) {
        return removeTab(reference, key);
    }

    /**
     * 保存Tab页
     *
     * @param {ReactComponent} reference React对应组件引用
     * @param {Object} data 当前数据记录
     * @param {Object} item 设置页面配置信息
     * @returns {Object} 返回最终状态
     */
    static save(reference, data, item) {
        return saveTab(reference, data, item);
    }
}

// =====================================================
// 页签
// =====================================================

/**
 * ## 「2阶」`Ex.rxTabAdd`
 *
 * 新增 Tab 页专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabAdd = (reference) => event => {
    Ux.prevent(event);
    const tabs = Tab.add(reference);
    /*
     * Tab中的 activeKey 需要拷贝到 $key 中赋值（保证数据本身是同步）
     */
    const view = View.switch(reference, Mode.ADD, tabs.activeKey);
    reference.setState({tabs, ...view, $inited: {}});
    rx(reference).openPost({});
};
/**
 * ## 「2阶」`Ex.rxTabClose`
 *
 * 关闭 Tab 页专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabClose = (reference) => (key, callbackState = {}) => {
    const state = Tab.remove(reference, key);
    /* 是否需要刷新？*/
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    reference.setState(state);
    rx(reference).closePost(key);
};
/**
 * ## 「2阶」`Ex.rxTabEdit`
 *
 * 编辑 Tab 页专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabEdit = (reference) => (key, data = {}, item = {}, callbackState = {}) => {
    /* 添加页转编辑页 */
    const view = View.switch(reference, Mode.EDIT, data.key);
    const tabs = Tab.save(reference, data, item);
    const state = {$inited: data, tabs, ...view};
    if (!Ux.isEmpty(callbackState)) {
        Object.assign(state, callbackState);
    }
    reference.setState(state);
    rx(reference).openPost(data);
};
/**
 * ## 「2阶」`Ex.rxTabOpen`
 *
 * 打开 Tab 页专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxTabOpen = (reference) => (key, data = {}, record) => {
    const view = View.switch(reference, Mode.EDIT, key);
    const tabs = Tab.edit(reference, data);
    // 注入上层变量
    if (record) {
        // rowData 专用注入
        view.$rowData = Ux.clone(record);
    }
    reference.setState({tabs, ...view, $inited: data});
    rx(reference).openPost(data);
};

/**
 * ## 「2阶」`Ex.rxCondition`
 *
 * ### 1.基本介绍
 *
 * 条件专用函数：清空设置双用，该函数主要针对列过滤条件执行操作
 *
 * 1. 设置流程：更新$condition
 * 2. 清空流程：执行`Ux.qrClear`清空操作（`__DELETE__`条件会被清除）
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} isClear 是否清除查询条件
 * @returns {Function} 生成函数
 */
const rxCondition = (reference, isClear = false) => {
    if (isClear) {
        /*
         * 清空列筛选
         */
        return (event) => {
            Ux.prevent(event);
            const {$condition = {}} = reference.state;
            /*
             * 条件本身大于0的时候执行
             */
            if (0 < Object.keys($condition).length) {
                /*
                 * Qr专用清除
                 */
                Ux.qrClear(reference);
            }
        };
    } else {
        /*
         * 设置列筛选
         */
        return ($condition = {}) => reference.setState({
            $condition, // 条件本身：field = value
        })
    }
};
/**
 * ## 「2阶」`Ex.rxFilter`
 *
 * ### 1.基本介绍
 *
 * 基础搜索 / 高级搜索专用函数，该函数会包含两部分输入：
 *
 * 1. 执行过查询条件处理过后的过滤条件`$filters`。
 * 2. 原始查询条件（规范化之前）`$filtersRaw`（可选）。
 *
 * ### 2.核心
 *
 * #### 2.1.$filtersRaw
 *
 * 在某些特定场景中，原始查询条件可追踪当前组件专用查询条件集合，所以除了规范化过后的查询条件以外，该函数提供了二义性输入。
 *
 * #### 2.2.$filters
 *
 * $filters状态变量在列表组件中只存在于基础搜索（搜索框）和高级搜索（查询表单），列过滤的搜索条件有另外的变量来完成。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxFilter = (reference) =>
    ($filters = {}, $filtersRaw) => {
        const state = {};
        if ($filtersRaw) {
            state['$filtersRaw'] = $filtersRaw;
        }
        state.$filters = Ux.clone($filters);
        reference.setState(state);
    };
// =====================================================
// 批量
// =====================================================
/**
 * ## 「2阶」`Ex.rxBatchDelete`
 *
 * ### 1.基本介绍
 *
 * 批量删除函数专用，根据options中的批量删除配置`ajax.batch.delete.uri`执行批量删除函数，该函数会触发批量操作。
 *
 * ### 2.使用场景
 *
 * #### 2.1.调用代码
 *
 * （无）
 *
 * #### 2.2.操作执行
 *
 * 1. 调用`Ux.sexBatch`从批量选择数据中读取被选择的主键集。
 * 2. 使用被选中的主键集调用批量删除接口执行批量删除。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchDelete = (reference) => (event) => {
    Ux.prevent(event);
    return Ux.sexBatch(reference, ($selected = []) => {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_BATCH_DELETE_URI];
        return Ux.ajaxDelete(uri, $selected);
    }, {name: "rxBatchDelete", message: G.Opt.MESSAGE_BATCH_DELETE});
};

// =====================================================
// 列操作
// =====================================================
/**
 * ## 「2阶」`Ex.rxColumn`
 *
 * ### 1.基本介绍
 *
 * 全列视图函数专用，直接根据`options`中的配置`ajax.column.full`执行模型下的全列读取，读取模式分：
 *
 * 1. 静态列`dynamic.column = false`（默认值），直接返回配置列信息，前端静态列配置。
 * 2. 动态列`dynamic.column = true`，直接返回动态配置列信息，动态列配置。
 *
 * ### 2.核心
 *
 * #### 2.1.增强列表
 *
 * 增强视图主要包含三个核心功能：
 *
 * 1. 读取模型关联视图全列。
 * 2. 读取定义好的我的视图列。
 * 3. 针对2中读取的我的试图列进行保存，创建新视图（目前版本只支持单视图）。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumn = (reference, config = {}) => Cm.switcher(reference, 'rxColumn',
    (params) => {
        const {options = {}, columns = []} = config;
        if (options[G.Opt.DYNAMIC_COLUMN]) {
            /*
             * 动态配置
             */
            const uri = options[G.Opt.AJAX_COLUMN_FULL];
            // MODULE
            if (options[G.Opt.AJAX_MODULE]) {
                params.module = options[G.Opt.IDENTIFIER];
            }
            return Ux.ajaxGet(uri, params);
        } else {
            /*
             * 静态配置
             */
            return Ux.promise(columns);
        }
    });
/**
 * ## 「2阶」`Ex.rxColumnMy`
 *
 * ### 1.基本介绍
 *
 * 我的视图函数专用，直接根据`options`中的配置`ajax.column.my`执行模型下的我的视图列读取。
 *
 * 1. 我的视图列不执行双模式，所有模式都可支持我的视图保存。
 * 2. 目前只有每个列表单视图操作，后期扩展多视图模式。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} config 列配置
 * @returns {Function} 生成函数
 */
const rxColumnMy = (reference, config = {}) => Cm.switcher(reference, 'rxColumnMy',
    (params) => {
        const {options = {}} = config;
        if (options[G.Opt.DYNAMIC_COLUMN]) {
            /*
             * 动态配置
             */
            let uri = options[G.Opt.AJAX_COLUMN_MY];
            // module 参数
            if (options[G.Opt.AJAX_MODULE]) {
                params.module = options[G.Opt.IDENTIFIER];
            }
            // view 参数
            // 「Vis」视图修改
            const {$myView} = reference.state;
            uri = _uriView(uri, {
                view: $myView,
                options
            }, reference);
            return Ux.ajaxGet(uri, params);
        }
    });

// =====================================================
// 搜索
// =====================================================
/**
 * ## 「2阶」`Ex.rxSearch`
 *
 * ### 1.基本介绍
 *
 * 搜索专用函数（列表组件主函数），它根据`ajax.search.uri`执行搜索，参数格式如：
 *
 * ```json
 * {
 *     "criteria": {},
 *     "sorter": [],
 *     "pager":{
 *         "page": 1,
 *         "size": 10
 *     },
 *     "projection": []
 * }
 * ```
 *
 * 参数格式参考Qr的格式语法。
 *
 * ### 2.核心
 *
 * 内置调用了`switcher`执行从状态state到属性props中的函数检索，检索合法时调用该函数，无法找到函数则抛出异常。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSearch = (reference) => Cm.switcher(reference, 'rxSearch',
    (params) => {
        /*
         * 必须配置 ajax.search.uri
         */
        const {options = {}, $myView} = reference.state;
        let uri = options[G.Opt.AJAX_SEARCH_URI];
        const module = options[G.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options.identifier)
        }
        // view 参数
        // 「Vis」视图修改
        uri = _uriView(uri, {
            view: $myView,
            options
        }, reference);
        return Ux.ajaxPost(uri, params).then(response => {
            if (response.__qr) {
                reference.setState({$myQr: response.__qr});
            }
            return Ux.promise(response);
        });
    });
/**
 * ## 「2阶」`Ex.rxColumnSave`
 *
 * ### 1.基本介绍
 *
 * 该函数为`rxColumnMy`的逆函数，此处不做多余说明，根据`options`中的`ajax.column.save`执行我的视图保存。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxColumnSave = (reference) => Cm.switcher(reference, 'rxColumnSave',
    (projection = []) => {
        const {options = {}, $myView} = reference.state;
        /* 当前组件中的状态定义 */
        let uri = options[G.Opt.AJAX_COLUMN_SAVE];
        // view 参数
        // 「Vis」视图修改
        uri = _uriView(uri, {
            view: $myView,
            options
        }, reference);
        return Ux.ajaxPut(uri, {
            // 此处只更新projection，新版多加一层 viewData
            // 防止和查询引擎参数格式冲突，后端自动检测会失败
            viewData: {
                projection
            }
        }).then(data => Ux.promise(data['projection']));
    }
);
const rxFilterSave = (reference) => Cm.switcher(reference, 'rxColumnSave',
    (criteria = {}) => {
        const {options = {}, $myView} = reference.state;
        /* 当前组件中的状态定义 */
        let uri = options[G.Opt.AJAX_COLUMN_SAVE];
        // view 参数
        // 「Vis」视图修改
        uri = _uriView(uri, {
            view: $myView,
            options
        }, reference);
        return Ux.ajaxPut(uri, {
            // 此处只更新criteria，新版多加一层 viewData
            // 防止和查询引擎参数格式冲突，后端自动检测会失败
            viewData: {
                criteria
            }
        }).then(data => {
            // Fix: $myQr
            const $myQr = data.criteria;
            reference.setState({$myQr});
            return Ux.promise($myQr);
        });
    }
);
const _uriView = (uri, {
    view = {}, options = {}
}, reference) => {
    let viewName = view.name;
    let position = options[G.Opt.AJAX_POSITION];
    if (position) {
        /*
         * 加密后处理
         */
        const positionValue = Ux.parsePosition(position, reference);
        return Ux.toUrl(uri, "view", encodeURIComponent(`[${viewName},${positionValue}]`));
    } else {
        if ("DEFAULT" !== viewName) {
            // view = [view];
            return Ux.toUrl(uri, "view", encodeURIComponent(`[${viewName}]`))
        } else {
            // view = DEFAULT
            return uri;
        }
    }
}
/**
 * ## 「2阶」`Ex.rxProjection`
 *
 * ### 1.基本介绍
 *
 * 根据系统中存储的`$columns/$columnsMy`执行视图层的列过滤专用函数，该函数内部存储了**全列**，根据传入的试图列构造新的查询视图。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxProjection = (reference) => ($columnsMy = [], addOn = {}) => {
    $columnsMy = Ux.clone($columnsMy);
    if (!$columnsMy.includes('key')) {
        $columnsMy = ['key'].concat($columnsMy);
    }
    /*
     * 处理 state 中的 table 部分
     */
    let {table = {}} = reference.state;
    /*
     * 表格 table 中的内容
     */
    const state = {
        $columnsMy,// 修改 $columnsMy 变量（我的视图信息更新）
    };
    if (!Ux.isEmpty(table)) {
        /*
         * $columns 为全列
         */
        const {$columns = []} = reference.state;
        /*
         * 本次更新列为 $columnsMy
         * $calculated 为计算的保留列信息，该列在 table 中会用来更新 table.columns 的信息
         */
        const $calculated = [];

        $columnsMy.forEach(field => {
            const column = Ux.elementUnique($columns, 'dataIndex', field);
            if (column) {
                $calculated.push(column);
            }
        })
        table = Ux.clone(table);
        table.columns = $calculated;
        state.table = table;// 修改 table 中专用的 table.
    }
    if (!Ux.isEmpty(addOn)) {
        Object.assign(state, addOn);
    }
    /*
     * {
     *      $columnsMy：我的视图会被更新
     *      table: 主要更新 columns
     *      $dirty: true（触发重新加载）
     * }
     */
    reference.setState(state);
};
// =====================================================
// 行操作
// =====================================================
/**
 * ## 「2阶」`Ex.rxDelete`
 *
 * ### 1.基本介绍
 *
 * 执行`options`配置中的`ajax.delete.uri`专用函数，从后端执行删除。
 *
 * ### 2.下层调用
 *
 * #### 2.1.调用代码
 *
 * ```js
 * Ex.rx(reference).delete(...);
 * ```
 *
 * #### 2.2.删除模式
 *
 * 删除模式主要在服务端实现而不是客户端
 *
 * 1. 物理删除：SQL语句执行DELETE语句真实删除数据（可以删除同时做备份和变更历史）。
 * 2. 逻辑删除：仅仅执行UPDATE语句更新某个标记位数据。
 *
 * #### 2.3.删除的影响
 *
 * 对列表而言，如果删除了某条记录而这条记录又在选择项中，则需要将`$selected`变量中选中项移除。
 *
 * #### 2.4.删除回调
 *
 * 系统提供了`rxPostDelete`函数用于执行删除回调操作，该操作位于删除之后执行（编程回调）。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxDelete = (reference) => (key, callback) => {
    if (key) {
        const {options = {}, $selected = []} = reference.state;
        const uri = options[G.Opt.AJAX_DELETE_URI];
        return Ux.ajaxDelete(uri, {key})
            .then(() => {
                    const num = $selected.indexOf(key);
                    //删除后从选中项中清除
                    if (-1 !== num) {
                        $selected.splice(num, 1);
                    }
                    //修改状态
                    if (0 === $selected.length) {
                        reference.setState({$selected: []});
                    } else {
                        reference.setState({$selected});
                    }
                    // 删除后续方法
                    const {rxPostDelete} = reference.props;
                    if (Ux.isFunction(rxPostDelete)) {
                        rxPostDelete({key});
                    }
                    callback(key);
                }
            )
            .catch(error => {
                console.error(error);
                reference.setState({$dirtyAsync: false});
            })
    }
};
/**
 * ## 「2阶」`Ex.rxView`
 *
 * ### 1.基本介绍
 *
 * 查询记录专用函数，用于查询当前系统中的记录（双击选中），直接执行`options`中的`ajax.get.uri`数据读取。
 *
 * ### 版本更新
 *
 * 1. 版本1：只能使用`:key`参数读取数据记录。
 * 2. 版本2：新增了可使用其他字段（唯一字段）来读取数据记录。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxView = (reference) => (key, record = {}) => {
    if (key) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_GET_URI];
        /*
         * operation for uri
         */
        const params = {};
        Object.keys(record).forEach(key => {
            if (!Ux.isObject(record[key]) && !Ux.isArray(record[key])) {
                params[key] = record[key];
            }
        })
        return Ux.ajaxGet(uri, params);
    }
};
/**
 * ## 「2阶」`Ex.rxSelected`
 *
 * ### 1.基本介绍
 *
 * 多选专用函数，该函数的基础封装仅执行一个操作，调用上层的`rxPostSelected`回调函数。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxSelected = (reference) => ($selected = [], $data = []) => {
    reference.setState({$selected});
    const {rxPostSelected} = reference.props;
    if (Ux.isFunction(rxPostSelected)) {
        rxPostSelected($data);
    }
};
// =====================================================
// 导入导出专用
// =====================================================
/**
 * ## 「2阶」`Ex.rxExport`
 *
 * ### 1.基本介绍
 *
 * 导出函数专用，根据`options`中的`ajax.export.uri`执行导出操作。
 *
 * 1. 导出函数必须传入基础参数集：标识应用、模型、查询条件。
 * 2. 查询条件直接走查询引擎，内置调用`Ux.ajaxPull`的下载函数（带权限）。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxExport = (reference) => (params = {}) => {
    if (!Ux.isEmpty(params)) {
        const {options = {}} = reference.state;
        let uri = options[G.Opt.AJAX_EXPORT_URI];
        const query = Ux.qrInherit(reference);
        /*
         * 带搜索条件导出
         */
        if (query.criteria) {
            params.criteria = Ux.clone(query.criteria);
        }
        const module = options[G.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options[G.Opt.IDENTIFIER])
        }
        return Ux.ajaxPull(uri, params);
    }
};
/**
 * ## 「2阶」`Ex.rxImport`
 *
 * ### 1.基本介绍
 *
 * 导入专用函数，根据`options`中的`ajax.import.uri`执行导入操作。
 *
 * 1. 导入函数必须传入`File`参数（上传文件）
 * 2. 内置调用`Ux.ajaxUpload`的上传函数（带权限）。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxImport = (reference) => (file) => {
    if (file) {
        const {options = {}} = reference.state;
        let uri = options[G.Opt.AJAX_IMPORT_URI];
        const module = options[G.Opt.AJAX_MODULE];
        if (module) {
            uri = Ux.toUrl(uri, "module", options[G.Opt.IDENTIFIER])
        }
        return Ux.ajaxUpload(uri, file);
    } else {
        console.error("上传文件有问题，请检查！", file);
    }
};
/**
 * ## 「2阶」`Ex.rxBatchEdit`
 *
 * ### 1.基本介绍
 *
 * 批量更新函数专用，根据options中批量更新配置`ajax.batch.update.uri`执行批量更新函数，该函数会触发批量操作。
 *
 * ### 2.下层调用
 *
 * #### 2.1.调用代码
 *
 * ```js
 * // 调用 rxBatchEdit 方法
 * Ex.rx(reference).batchEdit(...);
 * ```
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
    const {options = {}} = reference.state;
    let uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
    const module = options[G.Opt.AJAX_MODULE];
    if (module) {
        uri = Ux.toUrl(uri, "module", options[G.Opt.IDENTIFIER])
    }
    return Ux.ajaxPut(uri, params);
}, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
/**
 * ## 「标准」`Ex.rx`
 *
 * ### 1.基本介绍
 *
 * 主要用于调用上层函数
 *
 * 1. 调用 props 中的某个函数
 * 2. 调用 state 中的某个函数
 * 3. 最后执行该函数
 *
 * ```js
 *     return Ex.I.todo(request, false)
 *          .then(Ux.ajax2Dialog(ref, buildConfig(ref, "rejected"), true))
 *
 *              // 调用代码
 *              .then(response => Ex.rx(reference).close(response));
 * ```
 *
 * ### 2.函数列表
 *
 * | 函数名 | 调用函数 | 说明 |
 * |:---|:---|:---|
 * | assistIn | rxAssist | 辅助数据输入函数 |
 * | assistOut | rxAssist | 辅助数据输出函数 |
 * | 无 | rxBatchDelete | （批删）无主动调用接口 |
 * | batchEdit | rxBatchEdit | 批量更新专用函数 |
 * | 无 | rxChannel | 直接调用顶层通道方法，触发Fabric事件引擎 |
 * | 无 | rxColumn | 读取当前模型相关的所有列集（全视图）|
 * | 无 | rxColumnMy | 读取当前模型我的视图列（子视图）|
 * | 无 | rxColumnSave | 保存我的视图列 |
 * | condition | rxCondition | 条件处理专用函数 |
 * | delete | rxDelete | 单行删除专用函数 |
 * | dirty | doDirty | 脏状态处理函数 |
 * | 无 | rxDirty | 等价于 $dirty = true，doDirty的一半 |
 * | 无 | rxExport | 导出函数专用 |
 * | filter | rxFilter | 查询条件专用函数 |
 * | 无 | rxImport | 导入函数专用 |
 * | loading | doLoading | 加载状态处理函数 |
 * | 无 | rxLoading | 等价于 $loading = true, doLoading的一半 |
 * | closePost | rxPostClose |「外围生成」关闭Tab页后的执行函数。 |
 * | openPost | rxPostOpen |「外围生成」 打开Tab页后的执行函数。 |
 * | projection | rxProjection | 列过滤专用函数 |
 * | search | rxSearch | 搜索专用函数 |
 * | selected | rxSelected | 多选专用函数 |
 * | submitting | doSubmitting | 提交状态专用函数 |
 * | submittingStrict | doSubmitting | 提交状态专用函数（带错误信息） |
 * | 无 | rxTabAdd | 添加Tab页 |
 * | 无 | rxTabClose | 关闭Tab页 |
 * | 无 | rxTabEdit | 编辑Tab页 |
 * | 无 | rxTabOpen | 打开Tab页 |
 * | open | rxOpen |「外围生成」 打开页面专用函数 |
 * | close | rxClose |「外围生成」 关闭页面专用函数 |
 * | view | rxView | 单行查看专用函数 |
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} off 关闭错误信息
 * @returns {Object} 返回最终对象
 **/
const rx = (reference, off = false) => ({
    /*
    column: (full = true) => full ?
        // 读取全列
        Cm.seek(reference, 'rxColumn')([]) :
        // 读取我的列
        Cm.seek(reference, 'rxColumnMy')([]), */
    openPost: (data) =>
        Cm.seek(reference, 'rxPostOpen', ARGS)([data]),
    closePost: (key) =>
        Cm.seek(reference, 'rxPostClose', ARGS)([key]),
    // ------------ 辅助数据专用 --------
    assistIn: (key, data) =>
        Cm.seek(reference, 'rxAssist', ARGS)([key, data, false]),
    assistOut: (key, data) =>
        Cm.seek(reference, 'rxAssist', ARGS)([key, data, true]),
    // ------------ 处理开关页 ----------
    /* 主搜索方法 */
    search: (params) =>
        Cm.seek(reference, 'rxSearch')([params]),
    /* 更改 $condition */
    condition: (condition = {}) =>
        Cm.seek(reference, 'rxCondition')([condition]),
    /* 更改 $filters */
    filter: (filters = {}, filtersRaw) =>
        Cm.seek(reference, "rxFilter")([filters, filtersRaw]),
    /* 更改 $columnsMy */
    projection: (columnsMy = [], addOn = {}) =>
        Cm.seek(reference, 'rxProjection')([columnsMy, addOn]),
    // ------------ 行操作 ---------------
    /* 更改 $selected */
    selected: (selected = [], data = []) =>
        Cm.seek(reference, 'rxSelected')([selected, data]),
    /* Ajax 单行删除 */
    delete: (id, callback) =>
        Cm.seek(reference, 'rxDelete')([id, callback]),
    /* Ajax 批量更新 */
    batchEdit: (params = []) =>
        Cm.seek(reference, 'rxBatchEdit')([params]),
    /* Ajax 单行查看 */
    view: (id, record) =>
        Cm.seek(reference, 'rxView')([id, record]),
    // ------------ 打开 -----------------
    /* 打开新窗口 */
    open: (id, data, record) =>
        Cm.seek(reference, 'rxOpen')([id, data, record]),
    /* 窗口记录 关闭方法调用 */
    close: (data = {}, addOn) =>
        Cm.seek(reference, 'rxClose', {
            inError: !off,      // 特殊处理
        })([data, addOn]),
    // ------------ 状态 -----------------
    /* loading */
    loading: (loading = true, addOn = {}) =>
        Cm.seek(reference, 'doLoading', ARGS)([loading, addOn]),
    /* dirty */
    dirty: (dirty = true, addOn = {}) =>
        Cm.seek(reference, 'doDirty', ARGS)([dirty, addOn]),
    /* submitting */
    submitting: (submitting = true, addOn = {}) =>
        Cm.seek(reference, 'doSubmitting', ARGS)([submitting, addOn]),
    submittingStrict: (submitting = true, addOn = {}) =>
        Cm.seek(reference, 'doSubmitting')([submitting, addOn]),
    // ------------- 新方（双提交）-------------
});
// =====================================================
// 扩展专用函数
// =====================================================
/**
 * ## 「2阶」`Ex.rsVisible`
 *
 * ### 1.基本介绍
 *
 * $visible 生成函数，根据传入的`visible`生成不同函数，等价于生成：
 *
 * ```js
 * // 修改组件为显示
 * () => reference.setState({$visible: true});
 *
 * // 修改组件为隐藏
 * () => reference.setState({$visible: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.常用组件
 *
 * 该状态为窗口专用状态，通常应用于：
 *
 * * `<Modal/>`：弹出窗口
 * * `<Drawer/>`：抽屉窗口
 * * `<Popover/>`：浮游窗口
 *
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} visible 打开或关闭
 * @returns {Function} 生成函数
 */
const rsVisible = (reference, visible = true) =>
    Cm.boolean(reference, "$visible", visible);
/**
 * ## 「2阶」`Ex.rsLoading`
 *
 * ### 1.基本介绍
 *
 * $loading 生成函数，根据传入的`loading`生成不同函数，等价于生成：
 *
 * ```js
 * // 修改组件加载状态
 * () => reference.setState({$loading: true});
 *
 * // 修改组件加载完成状态
 * () => reference.setState({$loading: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.手动回调
 *
 * 当一个组件处于加载状态，它并不会自动执行加载，和`$dirty`有本质上的区别，但是开发人员可在某些特定的操作中执行特定加载回调手动改变状态。
 *
 * #### 2.2.高频函数
 *
 * 通常在修改`$loading`时会调用内部规范的`doLoading`专用函数，用于修改加载以及加载完成的状态。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} loading 打开或关闭
 * @returns {Function} 生成函数
 */
const rsLoading = (reference, loading = true) =>
    Cm.boolean(reference, "$loading", loading);
/**
 * ## 「2阶」`Ex.rsSubmitting`
 *
 * ### 1.基本介绍
 *
 * $submitting 生成函数，根据传入的`submitting`生成不同函数，等价于生成：
 *
 * ```js
 * // 修改组件提交状态
 * () => reference.setState({$submitting: true});
 *
 * // 修改组件提交完成状态
 * () => reference.setState({$submitting: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.回调
 *
 * 提交状态的切换主要应用于防重复提交，为表单重复提交提供一个过渡功能。
 *
 * #### 2.2.高频函数
 *
 * 通常在修改`$submitting`时会调用内部规范的`doSubmitting`专用函数，用于修改加载以及加载完成的状态。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} submitting 打开或关闭
 * @returns {Function} 生成函数
 */
const rsSubmitting = (reference, submitting = true) =>
    Cm.boolean(reference, "$submitting", submitting);
/**
 * ## 「2阶」`Ex.rsDirty`
 *
 * ### 1.基本介绍
 *
 * $dirty 生成函数，最终会根据传入的`dirty`生成不同函数，等价于生成：
 *
 * ```js
 * // 修改组件脏状态
 * () => reference.setState({$dirty: true});
 *
 * // 修改组件非脏状态
 * () => reference.setState({$dirty: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.脏状态
 *
 * **脏状态**表示当前列表会等待自动刷新，直到列表状态为非脏的状态。
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} dirty 打开或关闭
 * @returns {Function} 生成函数
 */
const rsDirty = (reference, dirty = true) =>
    Cm.boolean(reference, "$dirty", dirty);
/**
 * ## 「2阶」`Ex.rsOpened`
 *
 * ### 1.基本介绍
 *
 * $opened 生成函数，根据最终传入的`opened`生成不同函数，等价于生成:
 *
 *
 * ```js
 * // 修改组件打开状态
 * () => reference.setState({$opened: true});
 *
 * // 修改组件关闭状态
 * () => reference.setState({$opened: false});
 * ```
 *
 * ### 2.核心
 *
 * #### 2.1.使用场景
 *
 * 这个函数通常只在`<Tabs/>`组件中使用，修改了`$opened=true`时，可直接打开页签，而点击关闭后，则直接将页签关掉。
 *
 * `$opened`和`$visible`为最初设计的不同场景的打开和关闭状态，而后续很多组件直接使用了`$visible`而忽略掉`$opened`。
 *
 * @memberOf module:_rx
 * @param reference
 * @param opened
 * @returns {function(*=): void}
 */
const rsOpened = (reference, opened = true) =>
    Cm.boolean(reference, "$opened", opened);
export default {
    rsVisible,
    rsLoading,
    rsSubmitting,
    rsDirty,
    /**
     * ## 「1阶」`Ex.rxPostClose`
     *
     * ### 1.基本介绍
     *
     * 打开Tab页后置回调函数，设置 $opened = true。
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostClose: (reference) => (key) => rsOpened(reference, false)(key),
    /**
     * ## 「1阶」`Ex.rxPostClose`
     *
     * ### 1.基本介绍
     *
     * 关闭Tab页后置回调函数，设置 $opened = false。
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostOpen: (reference) => (data) => rsOpened(reference, true)(data),

    /**
     * ## 「1阶」`Ex.rxLoading`
     *
     * ### 1.基本介绍
     *
     * 加载状态切换函数，设置当前组件中`$loading = true`，该函数和`rsLoading`对应：
     *
     * 1. rsLoading负责生成可改变加载状态的二阶函数。
     * 2. rxLoading则直接生成`$loading = true`的一阶函数操作。
     *
     * > 第二参数为可合并的state状态数据，最终会调用`Object.assign`将附加状态合并到组件状态中。
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxLoading: (reference) => (loading, addOn = {}) => rsLoading(reference, loading)(addOn),
    /**
     * ## 「1阶」`Ex.rxSubmitting`
     *
     * ### 1.基本介绍
     *
     * 加载状态切换函数，设置当前组件中`$submitting = true`，该函数和`rsSubmitting`对应：
     *
     * 1. rsSubmitting负责生成可改变提交状态的二阶函数。
     * 2. rxSubmitting则直接生成`$submitting = true`的一阶函数操作。
     *
     * > 第二参数为可合并的state状态数据，最终会调用`Object.assign`将附加状态合并到组件状态中。
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxSubmitting: (reference) => (submitting, addOn = {}) => rsSubmitting(reference, submitting)(addOn),
    /**
     * ## 「1阶」`Ex.rxDirty`
     *
     * ### 1.基本介绍
     *
     * 脏状态切换函数，设置当前组件的`$dirty = true`，该函数和`rsDirty`对应：
     *
     * 1. rsDirty负责生成可改变脏状态的二阶函数。
     * 2. rxDirty则直接执行`$dirty = true`的一阶函数操作。
     *
     * > 第二参数为可合并的state状态数据，最终会调用`Object.assign`将附加状态合并到组件状态中。
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxDirty: (reference) => (dirty, addOn = {}) => rsDirty(reference, dirty)(addOn),
    /**
     * ## 「1阶」`Ex.rxAssist`
     *
     * ### 1.基本介绍
     *
     * rxAssist用于更改组件状态state中的专用辅助数据，它支持两种模式：
     *
     * 1. 添加/更新：使用添加更新模式`deleted=false`（默认），直接追加和更新辅助数据信息。
     * 2. 删除：使用删除模式`deleted=true`（传入），直接删除输入记录及。
     *
     * ### 2.下层调用
     *
     * #### 2.1.调用代码
     *
     * ```js
     * // 执行 deleted = false 添加更新辅助数据
     * Ex.rx(reference).assistIn(...);
     *
     * // 执行 deleted = true 删除更新辅助数据
     * Ex.rx(reference).assistOut(...);
     * ```
     *
     * > rx系列方法和rs系列方法并不对等，因为rs是为了生成函数专用方法，有可能一个方法生成两个函数。
     *
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxAssist: (reference) => (key, data, deleted = false) => {
        const saved = Ux.onSave(reference, key, data, deleted);
        console.log(saved)
        if (saved && Ux.isArray(saved)) {
            /*
             * 写 $a_<key> 专用
             */
            const $key = Ux.toKey(key);
            const state = {};
            state[$key] = Dsl.getArray(saved);
            reference.setState(state);
        }
    },

    rxBatchDelete,
    rxBatchEdit,

    rx,
    rxTabAdd,    // 打开一个新的 Tab 页
    rxTabClose,  // 关闭当前 Tab 页，如果需要刷新则第二参 $dirty = true
    rxTabEdit,   // 切换到 Edit 的 Tab 页
    rxTabOpen,   // 打开一个新的 Tab 页（带数据）


    rxSearch,
    /*
     * 针对列过滤的两种动作（设置/清除）
     * 清空动作：
     * 1）点击：__BTN_CLEAR_<field> 的按钮（列过滤同步）
     * 2）设置：$condition
     * 设置动作：
     * 1）直接设置 $condition
     */
    rxCondition,
    /*
     * 设置 $filters
     * 1）透过表单提交处理 $filters 的最终信息
     * 2）基础搜索 / 高级搜索（共享）
     */
    rxFilter,

    // 列操作
    /* 可外置传入 */ rxColumn,
    /* 可外置传入 */ rxColumnMy,
    /* 可外置传入 */ rxColumnSave,
    /* 可外置传入 */ rxFilterSave,
    /* 回调修改状态专用 */ rxProjection,


    // 行操作
    rxDelete,
    rxSelected,
    rxView,
    // 文件导入导出
    rxExport,
    rxImport
}

/**
 * # 函数模块
 *
 * ## 1.函数列表
 *
 * （略）参考`_rx`处文档。
 *
 * ## 2.基本介绍
 *
 * ### 2.1.函数子规范
 *
 * 1. rs全称是：Runtime State，为状态函数生成器。
 * 2. rx全称是：Runtime Executor，是执行函数生成器。
 * 3. `Ex.rx(reference)`调用后则可直接通过内置API调用上层的`rx/rs`函数，它不管生成，主管调用。
 * 4. 上层函数：先从状态中读取函数，若无法读取，则从属性中读取，状态中优先级更高。
 *
 * ### 2.2.回调函数表
 *
 * 回调函数是Extension扩展模块提供给开发人员专用的回调扩展接口，常用回调如下：
 *
 * |函数名|触发时间和含义|
 * |:---|:---|
 * |rxPostOpen|打开Tab页之后的回调|
 * |rxPostClose|关闭Tab页之后的回调|
 * |rxPostSelected|选中记录后的回调|
 * |rxPostDelete|删除数据之后的回调|
 * |rxPostEdit|编辑数据之后的回调|
 * |rxViewSwitch|视图改变之后的回调（主要针对页签状态变更）|
 *
 * > 其他回调后续补充……
 *
 * @module _rx
 */