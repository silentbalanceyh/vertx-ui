import Ux from 'ux';

const EXECUTOR = {
    // 只能选择
    LE: (item, config = {}) => item[config.field] <= config.value
}

const _execRule = (field) => (item = {}, limitation = {}, tree = {}) => {
    // 设置每个节点的信息
    const {op, config = {}} = limitation;
    const executor = EXECUTOR[op];
    // 构造新的 config
    const $config = {};
    $config.field = field;
    $config.value = config[field];
    if (Ux.isFunction(executor)) {
        if (item.hasOwnProperty(field)) {
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

export default {
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
        if (limitOp && !Ux.isEmpty(limitConfig)) {
            Ux.itTree(treeData, (item) => {
                /*
                 * 规则集和限制集
                 */
                Object.keys(limitConfig).forEach(flowKey => {
                    // flowKey 处理
                    const flowExecutor = _execRule(flowKey);
                    if (Ux.isFunction(flowExecutor)) {
                        // 执行每一个规则
                        flowExecutor(item, {
                            op: limitOp,            // 操作符号
                            config: limitConfig     // 配置数据
                        }, Ux.clone(tree));
                    }
                })
            })
        }
    },
    yoTree: (reference, tree = {}, treeData) => {
        const treeAttrs = Ux.clone(tree);
        treeAttrs.treeData = treeData;
        if (treeAttrs.checkable) {
            treeAttrs.onCheck = Ux.rxCheckedTree(reference, treeData);
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
                    const $keySet = Ux.elementUnique($data, 'key', keys[0]);
                    reference.setState({$keySet})
                } else {
                    // 反选
                    reference.setState({$keySet: undefined});
                }
            };
        }
        return treeAttrs;
    }
}