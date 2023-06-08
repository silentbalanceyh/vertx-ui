import __Zn from '../zero.uca.dependency';

const _configuration = (reference) => {
    const internal = __Zn.fromHoc(reference, "config");
    const {config = {}} = reference.props;
    const $config = __Zn.clone(internal);
    // linker, items = [], title
    if (config.title) {
        $config.title = config.title;
    }
    $config.linker =
        // 合并 linker
        Object.assign($config.linker, config.linker ? config.linker : {});
    $config.items = config.items ? config.items : [];
    // DEPT - 部门（部门经理）
    // COMPANY - 公司（法人）
    // TEAM - 业务组（组长）
    // 三种模式处理
    const {mode = "DEPT"} = config;
    $config.mode = mode;
    return $config;
}

const _findGroup = (reference, item = {}) => {
    const {$config = {}} = reference.state;
    const {mode = "DEPT", qr = {}} = $config;
    const uri = qr[mode];
    if (uri) {
        const criteria = {};
        criteria[`name,=`] = item.name;
        criteria[`code,=`] = item.code;
        return __Zn.ajaxPost(uri, {criteria}).then(result => {
            const response = __Zn.valueArray(result);
            if (1 === response.length) {
                return __Zn.promise(response[0]);
            } else return __Zn.promise({});
        })
    } else return __Zn.promise({});
}

const _findUser = (reference, record = {}) => {
    const {$config = {}} = reference.state;
    const {mode = "DEPT"} = $config;
    if (__Zn.isNotEmpty(record)) {
        let field;
        if ("DEPT" === mode) {
            field = "managerId";
        } else if ("TEAM" === mode) {
            field = "leaderId";
        }
        const key = record[field];
        return __Zn.ajaxPost("/api/user/search/employee", {
            criteria: {
                key,
            }
        }).then(user => {
            const result = __Zn.valueArray(user);
            if (1 === result.length && result[0]) {
                return __Zn.promise(result[0]);
            } else return __Zn.promise({});

        })
    } else return __Zn.promise({});
}

const onChange = (reference, item, values = {}, isDelete = false) => {
    if (isDelete) {
        const {value = {}} = reference.props;
        const $value = value != null ? __Zn.clone(value) : {};
        if ($value.hasOwnProperty(item.key)) {
            delete $value[item.key];
        }
        __Zn.fn(reference).onChange($value);
    } else {
        const {value = {}} = reference.props;
        const $value = value != null ? __Zn.clone(value) : {};
        const row = {};
        row[item.key] = true;
        row.name = item.name;
        Object.assign(row, values);
        $value[item.key] = row;
        __Zn.fn(reference).onChange($value);
    }
}

export default {
    componentInit: (reference) => {
        // 处理 items
        const config = _configuration(reference);
        const {items = []} = config;

        // 解析 options
        const options = [];
        items.forEach(item => {
            if ("string" === typeof item) {
                const literal = item.split(',');
                if (literal[0] && literal[1]) {
                    const option = {};
                    option.key = literal[0];
                    option.code = literal[0];
                    option.name = literal[1];
                    options.push(option);
                }
            } else if (__Zn.isObject(item)) {
                options.push(item);
            }
        });

        const {title = {}} = config;
        const $columns = [];
        ["managerName", "workNumber", "mobile"].forEach(field => {
            const column = {};
            column.field = field;
            column.label = title[field];
            $columns.push(column);
        })
        // 解析行标识
        const state = {};
        state.$config = config;
        state.$columns = $columns;
        state.$rows = options;
        // state.$ready = true;
        // 编辑初始化值
        const $keySet = [];
        const {value = {}} = reference.props;
        if (value) {
            // To avoid `null` value
            Object.keys(value).forEach(key => $keySet.push(key));
        }
        state.$keySet = $keySet;

        __Zn.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    },
    rxChecked: (reference, item) => (event) => {
        let {$keySet = [], $config = {}} = reference.state;
        $keySet = __Zn.clone($keySet);
        const checked = __Zn.ambEvent(event, {
            prevent: false,
            checked: true
        });
        if (checked) {
            $keySet.push(item.key);
            // 查询条件
            _findGroup(reference, item)
                .then(record => _findUser(reference, record))
                .then(record => {
                    __Zn.of(reference).in({
                        $keySet
                    }).handle(() => {

                        let values = {};
                        __Zn.writeLinker(values, $config, () => record);
                        values = __Zn.valueValid(values); // 必须全部有值
                        if (__Zn.isNotEmpty(values)) {
                            // 此处不调用 onChange
                            onChange(reference, item, values);
                        }
                    })
                    // reference.?etState({$keySet});
                    // let values = {};
                    // __Zn.writeLinker(values, $config, () => record);
                    // values = __Zn.valueValid(values); // 必须全部有值
                    // if (__Zn.isNotEmpty(values)) {
                    //     // 此处不调用 onChange
                    //     onChange(reference, item, values);
                    // }
                })
        } else {
            $keySet = $keySet.filter(key => key !== item.key);
            __Zn.of(reference).in({
                $keySet
            }).handle(() => {

                // onChange 只负责删除数据
                onChange(reference, item, {}, true)
            })
            // reference.?etState({$keySet});
            // // onChange 只负责删除数据
            // onChange(reference, item, {}, true)
        }
    },
    rxSelected: (reference, item) => (values = {}) =>
        onChange(reference, item, values)
}