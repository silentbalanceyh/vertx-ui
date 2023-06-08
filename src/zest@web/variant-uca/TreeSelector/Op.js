import __Zn from '../zero.uca.dependency';

const EXECUTOR = {
    // 只能选择Level小的
    LE: (item, config = {}) => item[config.field] <= config.value,
    // 只能选择子节点
    EQ: (item, config = {}) => item[config.field] === config.value
}

const _execRule = (field) => (item = {}, limitation = {}, tree = {}) => {
    // 设置每个节点的信息
    const {op, config = {}} = limitation;
    const executor = EXECUTOR[op];
    // 构造新的 config
    const $config = {};
    $config.field = field;
    $config.value = config[field];
    // 构造新的值处理
    if (__Zn.isFunction(executor)) {
        if (item.hasOwnProperty(field)) {
            /*
             * limitOp = 操作符
             * limitConfig = 操作配置，存在字段值
             */
            item.checkable = executor(item, $config); // (item._level <= $selectable);
            if (tree.checkable) {
                // 强制性
                item.selectable = false;
            } else {
                // 设置选择
                item.selectable = executor(item, $config);
            }
        } else {
            item.selectable = false;
            item.checkable = false;
        }
    }
}

const Tree = {
    yoTreeData: (reference, treeData = []) => {
        const {tree = {}} = reference.state;
        const {config = {}, ...jsx} = reference.props;
        /*
         * 查看 tree 中的 checkable 是 true/false
         * 如果是 true，则是 Checkbox，如果是 false，则是单选
         * 特定配置：selection 配置项处理
         * {
         *      "limitation": 模式,
         *      "level": 限制选择的等级,
         *      "display": 显示的字段信息
         * }
         */
        const {selection = {}, selectable = {}} = config;
        const configuration = {};
        Object.assign(configuration, selection);                // 静态配置
        if (selectable[jsx.id]) {
            Object.assign(configuration, selectable[jsx.id]);   // 服务端配置
        }
        const {limitOp, limitConfig = {}} = configuration;
        /*
         * 处理 limit 信息
         * limitOp,
         * limitConfig
         */
        if (limitOp && !__Zn.isEmpty(limitConfig)) {
            __Zn.itTree(treeData, (item) => {
                /*
                 * 规则集和限制集
                 */
                Object.keys(limitConfig).forEach(flowKey => {
                    // flowKey 处理
                    const flowExecutor = _execRule(flowKey);
                    if (__Zn.isFunction(flowExecutor)) {
                        // 执行每一个规则
                        flowExecutor(item, {
                            op: limitOp,            // 操作符号
                            config: limitConfig     // 配置数据
                        }, __Zn.clone(tree));
                    }
                })
            })
        }
    },
    yoTree: (reference, tree = {}, treeData) => {
        const treeAttrs = __Zn.clone(tree);
        treeAttrs.treeData = treeData;
        if (treeAttrs.checkable) {
            treeAttrs.onCheck = __Zn.rxCheckedTree(reference, treeData);
        }
        return treeAttrs;
    },
    yiTree: (reference, config = {}) => {
        const treeAttrs = {};
        const {selection = {}} = config;
        Object.assign(treeAttrs, selection);
        /*
         * showLine 配置
         */
        if (selection.hasOwnProperty('showLine')) {
            treeAttrs.showLine = selection.showLine;
        }
        if (selection.multiple) {
            /*
             * 多选（在render周期构造 onCheck）
             */
            treeAttrs.checkable = true;
        } else {
            /*
             * 单选，多选会在 render 流程注入标准方法
             */
            treeAttrs.onSelect = (keys) => {
                const {$data = []} = reference.state;
                if (1 === keys.length) {
                    const $keySet = __Zn.elementUnique($data, 'key', keys[0]);
                    __Zn.of(reference).in({
                        $keySet
                    }).done();
                    // reference.?etState({$keySet})
                } else {
                    // 反选
                    __Zn.of(reference).in({
                        $keySet: undefined
                    }).done();
                    // reference.?etState({$keySet: undefined});
                }
            };
        }
        return treeAttrs;
    }
}

const yiClick = (reference, config = {}) => event => {
    // 常用的事件处理
    __Zn.prevent(event);
    // 初始化数据
    __Zn.of(reference).in({
        // $loading: true,             // 是否在加载
        // $visible: true,             // 窗口是否显示
        $data: [],                  // 当前窗口的数据信息
        $keySet: undefined          // 在窗口中的选中项
    }).loading(false).open().handle(() => {

        /**
         * 解析Ajax参数信息
         */
        const params = __Zn.xtLazyAjax(reference, config);
        __Zn.asyncData(config.ajax, params, ($data) => {
            $data = __Zn.valueArray($data);
            /*
             * 未使用查询引擎的情况，判断 config.exclude
             * 执行客户端过滤，一般选择父节点时候不允许选择当前节点
             * 去掉 config.exclude 模式
             */
            if (config.exclude) {
                const ref = __Zn.onReference(reference, 1);
                const except = __Zn.parseAjax({key: config.exclude}, ref);
                $data = $data.filter(item => except.key !== item.key);
            }
            __Zn.of(reference).in({
                $data
            }).load(false).done();
            // reference.?etState({
            //     $loading: false,
            //     $data
            // });
        });
    })
    // reference.?etState({
    //     $loading: true,             // 是否在加载
    //     $visible: true,             // 窗口是否显示
    //     $data: [],                  // 当前窗口的数据信息
    //     $keySet: undefined          // 在窗口中的选中项
    // });
    /**
     * 解析Ajax参数信息
     */
    // const params = __Zn.xtLazyAjax(reference, config);
    // __Zn.asyncData(config.ajax, params, ($data) => {
    //     $data = __Zn.valueArray($data);
    //     /*
    //      * 未使用查询引擎的情况，判断 config.exclude
    //      * 执行客户端过滤，一般选择父节点时候不允许选择当前节点
    //      * 去掉 config.exclude 模式
    //      */
    //     if (config.exclude) {
    //         const ref = __Zn.onReference(reference, 1);
    //         const except = __Zn.parseAjax({key: config.exclude}, ref);
    //         $data = $data.filter(item => except.key !== item.key);
    //     }
    //     reference.?etState({
    //         $loading: false,
    //         $data
    //     });
    // });
};
const yiDefault = (reference = {}) => {
    const {config = {}} = reference.props;
    /*
     * 各部分组件配置处理
     */
    const dialog = __Zn.xtDialogConfig(reference, config);
    const onClick = yiClick(reference, config);
    const tree = Tree.yiTree(reference, config);
    return {
        onClick,
        dialog,
        tree,
        $ready: true
    }
};
const yiValue = (reference, jsx = {}) => {
    // Fix: valueLimit -> yoLimit
    const inputAttrs = __Zn.yoLimit(jsx);
    if (undefined === inputAttrs.value) {
        /*
         * 只有 undefined 的时候触发
         */
        const {$defaultValue} = reference.state;
        if ($defaultValue) {
            inputAttrs.value = $defaultValue;
        }
    }
    /*
     * display 显示处理
     */
    const {tree, $data = []} = reference.state;
    if (tree.checkable) {
        // 多选才执行
        if (inputAttrs.value && __Zn.isArray(inputAttrs.value)) {
            const {config = {}} = reference.props;
            const {selection = {}} = config;
            if (selection.display) {
                const valueSet = new Set(inputAttrs.value);
                inputAttrs.value = $data
                    .filter(item => valueSet.has(item.key))
                    .map(item => item[selection.display]);
            }
        }
    }
    return inputAttrs;
};
export default {
    yiDefault,
    yiValue,
    /*
     * Tree 操作中的三个核心方法
     * 1) - yiTree
     * 2) - yoTree
     * 3) - yoTreeData
     */
    yoTree: Tree.yoTree,
    yoTreeData: Tree.yoTreeData,
    yoCombine: __Zn.xtDialogCombine,
}