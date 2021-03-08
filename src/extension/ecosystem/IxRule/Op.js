import Ux from 'ux';

const onChange = (reference, data) => {
    const {onChange} = reference.props;
    if (Ux.isFunction(onChange)) {
        const normalized = [];
        data.filter(each => !!each.rules)
            .filter(each => 0 < each.rules.length)
            .forEach(each => {
                if (1 === each.rules.length) {
                    normalized.push(each.rules[0]);
                } else {
                    normalized.push(each.rules);
                }
            });
        onChange(normalized);
    }
}

const onData = (reference, key, selected = []) => {
    const {data = []} = reference.state;
    const $data = Ux.clone(data);
    $data.forEach(each => {
        if (key === each.key) {
            each.rules = selected;
        }
    });
    reference.setState({data: $data});
    onChange(reference, $data);
}
const onRemove = (reference, key, removed) => {
    const {data = [], $selectedKeys = []} = reference.state;
    const selectedKey = $selectedKeys[0];
    let $selectedFields = []
    const $data = Ux.clone(data);
    $data.forEach(each => {
        if (key === each.key) {
            let rules = each.rules;
            if (removed) {
                // 删除某个
                rules = rules.filter(rule => removed !== rule);
            } else {
                // 全部删除
                rules = [];
            }
            each.rules = rules;
        }
        if (selectedKey === each.key) {
            $selectedFields = each.rules;
        } else {
            $selectedFields = []
        }
    });
    reference.setState({data: $data, $selectedFields});
    onChange(reference, $data);
}
export default {
    /* 选中某个标识规则 */
    onRowSelected: (reference) => ($selectedKeys) => {
        const key = $selectedKeys[0];
        let $selectedFields = [];
        const {data = []} = reference.state;
        data.forEach(each => {
            if (key === each.key) {
                $selectedFields = each.rules;
            }
        })
        reference.setState({$selectedKeys, $selectedFields});
    },
    onChecked: (reference) => ($selectedFields = []) => {
        /* 选中标识规则（追加）*/
        reference.setState({$selectedFields})
    },
    onYes: (reference) => (event) => {
        Ux.prevent(event);
        /* 选中字段集合 */
        const {$selectedFields, $selectedKeys} = reference.state;
        /* 选中 */
        if (1 === $selectedKeys.length) {
            const key = $selectedKeys[0];
            onData(reference, key, $selectedFields);
        }
    },
    onClose: (reference, record, removed) => (event) => {
        Ux.prevent(event);
        /* 选中字段集合 */
        onRemove(reference, record.key, removed);
    },
    onSort: (reference, index, up = true) => (event) => {
        Ux.prevent(event);
        let {data = []} = reference.state;
        data = Ux.elementWrap(data, index, up ? (index - 1) : index + 1);
        data = Ux.clone(data);
        reference.setState({data});
    },
    doClean: (reference, record = {}) => {
        /*
        * 删除选中行
        * */
        onRemove(reference, record.key);
    },
    isDisabled: (reference) => {
        /*
         * 是否禁用按钮
         */
        const {$selectedKeys = []} = reference.state;
        if (1 === $selectedKeys.length) {
            const key = $selectedKeys[0];
            const {data = [], $selectedFields} = reference.state;
            const item = Ux.elementUnique(data, 'key', key);
            if (item) {
                return !Ux.isDiff($selectedFields, item.rules);
            } else return true;
        } else return true;
    },
    onRule: (reference, field) => (each) => {
        const {data = {}} = reference.state;
        data[field] = each;
        reference.setState({data});
        const {onChange} = reference.props;
        onChange(data);
    }
}