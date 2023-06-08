import __Zn from './zero.module.dependency';

const sexCab = (reference = {}, key) => {
    if (undefined === key) {
        /*
         * 直接返回 props 中的 config
         */
        const {config = {}} = reference.props;
        return config;
    } else if ("string" === typeof key) {
        if (0 < key.indexOf(".")) {
            /*
             * key 中包含 . 操作符
             */
            const keys = key.split('.');
            return sexCab(reference, keys);
        } else {
            /*
             * 直接读取静态文件，state中的 $hoc
             */
            const config = __Zn.fromHoc(reference, key);
            return config ? config : {};
        }
    } else if (__Zn.isArray(key)) {
        /*
         * key是数组
         */
        const config = __Zn.fromPath(reference, key);
        return config ? config : {};
    } else {
        /*
         * key是对象
         */
        return __Zn.isObject(key) ? key : {};
    }
};

const sexOp = (reference, events = {}, key = "op") => {
    const $op = __Zn.fromHoc(reference, key);
    if (__Zn.isArray($op)) {
        $op.forEach(op => {
            let executor = events[op.key];
            if (__Zn.isFunction(executor)) {
                executor = executor(reference);
                if (__Zn.isFunction(executor)) {
                    op.onClick = executor;
                }
            }
        })
    }
    return $op;
}
const sexIdentifier = (reference, config = {}) => {
    const {
        dataKey = "data.category",
        parentField = "parentId"
    } = config;
    let identifier = null;
    const {$options = {}, $identifier} = reference.props;
    if ($identifier) {
        identifier = $identifier;
    } else {
        const {tree = []} = $options;
        if (0 < tree.length) {
            const treeArray = __Zn.onDatum(reference, dataKey);
            identifier = __Zn.treeShared(tree, treeArray, {
                parent: parentField,
                target: "identifier"
            });
        }
    }
    return identifier;
};

const sexTable = (reference, key) => {
    const config = sexCab(reference, key);
    /*
     * 表格专用处理
     */
    const $config = __Zn.clone(config);
    $config.columns = __Zn.configColumn(reference, config.columns);
    $config.className = "ux_table";
    $config.pagination = {size: "small"};
    return $config;
}
export default {
    sexOp,
    sexIdentifier,
    sexCab,
    sexTable,
}