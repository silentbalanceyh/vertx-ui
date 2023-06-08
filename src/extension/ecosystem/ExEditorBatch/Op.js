import Ux from 'ux';

const rxSubmit = (reference) => (event) => {
    const {rxBatchEdit} = reference.props;
    if (!Ux.isFunction(rxBatchEdit)) {
        throw new Error("[ Ex ] 核心函数丢失：rxBatchEdit ");
    }
    Ux.prevent(event);
    const {$data = [], $combine = {}} = reference.state;
    const {$selected = []} = reference.props;
    /*
     * 验证是否完整
     */
    const validated = $data
        .filter(item => !!item.name)
        .filter(item => !!item.value).length;
    if ($data.length === validated) {
        if (0 < $selected.length) {
            /*
             * 构造批量更新的数据
             */
            const records = [];
            $selected.forEach(key => {
                const record = {};
                record.key = key;
                $data.forEach(field => record[field.name] = field.value);
                records.push(record);
            });

            Ux.of(reference)._.submitting().then(() => {
                Ux.fn(reference).rxBatchEdit(records, {
                    message: $combine
                }).then(() => {
                    /*
                     * 关闭窗口
                     */
                    Ux.of(reference)._.closeAnd({}, {$loading: true});
                })
            })
        } else {
            console.error("[ Ex ] 运行时错误，$selected 为空！");
        }
    } else {
        Ux.messageFailure($combine);
    }
}

const rxChange = (reference, record) => (select) => {
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => record === item.key).forEach(each => {
        each.name = select; // 根据字段选择
        if (!each.hasOwnProperty('value')) {
            delete each.value;  // 清空值
        }
    });
    Ux.of(reference).in({$data}).done()
    // reference.?etState({$data});
};
const yoTable = (reference) => {
    const {$columns = [], $data = []} = reference.state;
    const tables = {};
    tables.className = "ux_table";
    tables.dataSource = $data;
    tables.columns = $columns;
    tables.pagination = false;
    return tables;
}
const yoButton = (reference) => {
    const buttons = {};
    const {$combine = {}} = reference.state;
    buttons.id = $combine.button;
    buttons.className = "ux_hidden";
    buttons.onClick = rxSubmit(reference);
    return buttons;
}
export default {
    rxChange,
    rxSubmit,
    yoTable,
    yoButton,
}