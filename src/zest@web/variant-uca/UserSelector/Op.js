import __Zn from '../zero.uca.dependency';
import _xtTree from './Op.Tree';

const _configuration = (reference) => {
    const internal = __Zn.fromHoc(reference, "config");
    const {config = {}} = reference.props;
    const $config = __Zn.clone(internal);
    // user
    if (config.user) {
        // 传入 user 优先
        $config.user = config.user;
        const params = {user: $config.user};
        $config.validation = __Zn.formatExpr($config.validation, params, true);
        $config.window = __Zn.formatExpr($config.window, params, true);
    }

    // linker
    if (__Zn.isNotEmpty(config.linker)) {
        $config.linker = __Zn.clone(config.linker);
    }

    // query -> ajax["params.criteria"];
    if (config.query) {
        Object.assign($config.ajax["params.criteria"], config.query);
    }
    // 必须解析
    $config.ajax = __Zn.aiExprAjax($config.ajax);
    return $config;
}

const _rxSearch = (reference, config = {}) => (text) => {
    let {$filters = {}} = reference.state;
    $filters = __Zn.clone($filters);
    $filters[""] = true;

    const condition = [];
    const {search = {}} = config;
    Object.keys(search).forEach(key => condition.push(key));
    const condSearch = $filters["$keyword"] ? $filters["$keyword"] : {};
    if (text) {
        condition.forEach(cond => condSearch[cond] = text);
        condSearch[""] = false; // Or的语句
    } else {
        condition.forEach(cond => condSearch[cond] = "__DELETE__");
    }
    $filters["$keyword"] = condSearch;
    __Zn.of(reference).in({
        $filters
    }).loading(false).handle(() => {
        const {onClick} = reference.state;
        if (__Zn.isFunction(onClick)) {
            onClick();
        }
    }, 0)
    // reference.?etState({$filters, $loading: true});
    // __Zn.toLoading(() => {
    //     const {onClick} = reference.state;
    //     if (__Zn.isFunction(onClick)) {
    //         onClick();
    //     }
    // })
};

export default {
    componentInit: (reference = {}) => {
        const assist = __Zn.fromHoc(reference, "assist");
        const ref = __Zn.onReference(reference, 1);
        return __Zn.asyncAssist(assist, ref, {}).then(state => {
            // 合并配置
            const config = _configuration(reference);
            /*
             * 各部分组件配置处理
             */
            const dialog = __Zn.xtDialogConfig(reference, config);
            const onClick = __Zn.xtDialogClick(reference, config);

            const search = __Zn.xtSearchConfig(reference, config);
            search.onSearch = _rxSearch(reference, config);
            // 通用表格方法
            const table = __Zn.xtTableConfig(reference, config);
            const tree = _xtTree(reference, config, state);
            const attrs = {
                onClick, dialog, $ready: true,
                table, search, tree,
            };
            /*
             * 非表单模式下专用，$keySet 结构
             * {
             *     "key": "xxxxx"
             * }
             */
            Object.assign(state, {
                ...attrs,
                $visible: false,
                $loading: false,
                $data: [],
                $keySet: undefined,
                $config: config,    // 配置信息
            })
            __Zn.xtLazyInit(reference, {state, config});
            // reference.setState(state);
        })
    },

    yoPager: __Zn.xtTablePager,
    yoCombine: __Zn.xtDialogCombine,
    yoSelected: (reference, table = {}) => {
        const {$keySet} = reference.state;
        if (table.rowSelection) {
            if ($keySet) {
                // P1：state 状态中高优先级
                table.rowSelection.selectedRowKeys = [$keySet.key];
            } else {
                // P2：props 属性中低优先级，是否外部传入
                const {$keySet} = reference.props;
                if ($keySet) {
                    table.rowSelection.selectedRowKeys = [$keySet.key];
                } else {
                    table.rowSelection.selectedRowKeys = [];
                }
            }
        }
        return table;
    },
    /* 生命周期 constructor */
    yoValue: (reference, jsx = {}) => {
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
        return inputAttrs;
    },
}