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
 * ## 扩展函数
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
 * ## 扩展函数
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
 * ## 扩展函数
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
 * ## 扩展函数
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
// =====================================================
// 搜索
// =====================================================
/**
 * ## 扩展函数
 *
 * 搜索专用函数
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
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_SEARCH_URI];
        return Ux.ajaxPost(uri, params);
    });
/**
 * ## 扩展函数
 *
 * 条件专用函数：清空设置双用
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
 * ## 扩展函数
 *
 * 基础搜索 / 高级搜索
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
 * ## 扩展函数
 *
 * 批量删除函数
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
/**
 * ## 扩展函数
 *
 * 批量更新函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxBatchEdit = (reference) => (params = []) => Ux.sexBatch(reference, ($selected = []) => {
    const {options = {}} = reference.state;
    const uri = options[G.Opt.AJAX_BATCH_UPDATE_URI];
    return Ux.ajaxPut(uri, params);
}, {name: "rxBatchEdit", reset: true, message: G.Opt.MESSAGE_BATCH_UPDATE});
// =====================================================
// 列操作
// =====================================================
/**
 * ## 扩展函数
 *
 * 全列读取专用
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
            params.module = options[G.Opt.IDENTIFIER];
            return Ux.ajaxGet(uri, params);
        } else {
            /*
             * 静态配置
             */
            return Ux.promise(columns);
        }
    });
/**
 * ## 扩展函数
 *
 * 读取我的列
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
            const uri = options[G.Opt.AJAX_COLUMN_MY];
            params.module = options[G.Opt.IDENTIFIER];
            return Ux.ajaxGet(uri, params);
        }
    });
/**
 * ## 扩展函数
 *
 * 视图保存函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {Object} consumer 后置函数，用于执行保存过后的回调
 * @returns {Function} 生成函数
 */
const rxColumnSave = (reference, consumer = {}) => Cm.switcher(reference, 'rxColumnSave',
    (params = []) => {
        const {options = {}} = reference.state;
        /* 当前组件中的状态定义 */
        const uri = options[G.Opt.AJAX_COLUMN_SAVE];
        return Ux.ajaxPut(uri, params);
    }
);
/**
 * ## 扩展函数
 *
 * 列过滤专用执行函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxProjection = (reference) => ($columnsMy = [], addOn = {}) => {
    const $my = Ux.immutable($columnsMy);
    $columnsMy = Ux.clone($columnsMy);
    if (!$my.contains('key')) {
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
        const $columnsOfMy = Ux.immutable($columnsMy);
        const $calculated = $columns
            .filter(column => $columnsOfMy.contains(column.dataIndex));
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
 * ## 扩展函数
 *
 * 删除专用函数
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
 * ## 扩展函数
 *
 * 查询记录专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxView = (reference) => (key) => {
    if (key) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_GET_URI];
        return Ux.ajaxGet(uri, {key});
    }
};
/**
 * ## 扩展函数
 *
 * 多选专用函数
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
 * ## 扩展函数
 *
 * 导出专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxExport = (reference) => (params = {}) => {
    if (!Ux.isEmpty(params)) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_EXPORT_URI];
        const query = Ux.qrInherit(reference);
        /*
         * 带搜索条件导出
         */
        if (query.criteria) {
            params.criteria = Ux.clone(query.criteria);
        }
        return Ux.ajaxPull(uri, params);
    }
};
/**
 * ## 扩展函数
 *
 * 导入专用函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 生成函数
 */
const rxImport = (reference) => (file) => {
    if (file) {
        const {options = {}} = reference.state;
        const uri = options[G.Opt.AJAX_IMPORT_URI];
        return Ux.ajaxUpload(uri, file);
    } else {
        console.error("上传文件有问题，请检查！", file);
    }
};
/**
 * ## 扩展函数
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
 * 返回的数据结构如下：
 *
 * | 函数名 | 调用函数 | 说明 |
 * |:---|:---|:---|
 * | openPost | rxPostOpen | 打开Tab页后的执行函数 |
 * | closePost | rxPostClose | 关闭Tab页后的执行函数 |
 * | assistIn | rxAssist | 辅助数据输入函数 |
 * | assistOut | rxAssist | 辅助数据输出函数 |
 * | search | rxSearch | 搜索专用函数 |
 * | condition | rxCondition | 条件处理专用函数 |
 * | filter | rxFilter | 查询条件专用函数 |
 * | projection | rxProjection | 列过滤专用函数 |
 * | selected | rxSelected | 多选专用函数 |
 * | delete | rxDelete | 单行删除专用函数 |
 * | batchEdit | rxBatchEdit | 批量更新专用函数 |
 * | view | rxView | 单行查看专用函数 |
 * | open | rxOpen | 打开页面专用函数 |
 * | close | rxClose | 关闭页面专用函数 |
 * | loading | doLoading | 加载状态处理函数 |
 * | dirty | doDirty | 脏状态处理函数 |
 * | submitting | doSubmitting | 提交状态专用函数 |
 * | submittingStrict | doSubmitting | 提交状态专用函数（带错误信息） |
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
    view: (id) =>
        Cm.seek(reference, 'rxView')([id]),
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
});
// =====================================================
// 扩展专用函数
// =====================================================
/**
 * ## 扩展函数「2阶」
 *
 * $visible 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} visible 打开或关闭
 * @returns {Function} 生成函数
 */
const rsVisible = (reference, visible = true) =>
    Cm.boolean(reference, "$visible", visible);
/**
 * ## 扩展函数「2阶」
 *
 * $loading 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} loading 打开或关闭
 * @returns {Function} 生成函数
 */
const rsLoading = (reference, loading = true) =>
    Cm.boolean(reference, "$loading", loading);
/**
 * ## 扩展函数「2阶」
 *
 * $submitting 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} submitting 打开或关闭
 * @returns {Function} 生成函数
 */
const rsSubmitting = (reference, submitting = true) =>
    Cm.boolean(reference, "$submitting", submitting);
/**
 * ## 扩展函数「2阶」
 *
 * $dirty 生成函数
 *
 * @memberOf module:_rx
 * @param {ReactComponent} reference React对应组件引用
 * @param {boolean} dirty 打开或关闭
 * @returns {Function} 生成函数
 */
const rsDirty = (reference, dirty = true) =>
    Cm.boolean(reference, "$dirty", dirty);
/**
 * ## 扩展函数「2阶」
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
     * ## 扩展函数
     *
     * 打开Tab页后置回调函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostClose: (reference) => (key) => rsOpened(reference, false)(key),
    /**
     * ## 扩展函数
     *
     * 关闭Tab页后置回调函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxPostOpen: (reference) => (data) => rsOpened(reference, true)(data),

    /**
     * ## 扩展函数
     *
     * 加载状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxLoading: (reference) => (loading, addOn = {}) => rsLoading(reference, loading)(addOn),
    /**
     * ## 扩展函数
     *
     * 提交状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxSubmitting: (reference) => (submitting, addOn = {}) => rsSubmitting(reference, submitting)(addOn),
    /**
     * ## 扩展函数
     *
     * 脏状态切换函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxDirty: (reference) => (dirty, addOn = {}) => rsDirty(reference, dirty)(addOn),
    /**
     * ## 扩展函数
     *
     * 辅助数据专用函数
     *
     * @memberOf module:_rx
     * @param {ReactComponent} reference React对应组件引用
     * @returns {Function} 生成函数
     */
    rxAssist: (reference) => (key, data, deleted = false) => {
        const saved = Ux.onSave(reference, key, data, deleted);
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

    rxBatchDelete,
    rxBatchEdit,

    // 列操作
    /* 可外置传入 */ rxColumn,
    /* 可外置传入 */ rxColumnMy,
    /* 可外置传入 */ rxColumnSave,
    /* 回调修改状态专用 */ rxProjection,


    // 行操作
    rxDelete,
    rxSelected,
    rxView,
    // 文件导入导出
    rxExport,
    rxImport,
}
/*
 * 函数基础规范
 * 1）从组件最外层传入的函数（无关组件的使用 fn，相关的还是要使用 rx）：
 * -- 1.1. fn 开头，Function 缩写
 * ---- fnApp（读取应用程序数据）
 * ---- fnOut（Redux写入树）
 * 2）组件内部从上层往下继承的函数
 * 为了兼容原生态的 Ux 使得输入统一，外层函数全部遵循
 * -- 2.1. rx 开头，Runtime Executor缩写
 * ---- (1) 这种函数直接调用 Ex.rx(reference).<name> 执行注入
 * ---- (2) 调用父类传入：const fun = Ex.rx(reference).do<Name>()
 * -- 2.2. 状态函数比较特殊主要包括，Runtime State缩写
 * ---- (1) 绑定：const fun = Ex.rs(reference).<name> / 这种直接调用 fun()
 * ---- (2) 调用父类传入：const fun = Ex.rs(reference).do<Name>()
 * ---- (3) 暂时开放的状态函数：
 * -------- $visible
 * -------- $submitting
 * -------- $loading
 */