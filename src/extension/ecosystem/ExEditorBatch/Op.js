import Ux from 'ux';
import Ex from "ex";

const rxSubmit = (reference) => (event) => {
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
            /*
             * 提交处理
             */
            Ex.rx(reference).submitting();
            /*
             * 调用外层的 rxBatchEdit 函数
             */
            Ux.toLoading(() => Ex.rx(reference).batchEdit(records)
                .then(() => {
                    /*
                     * 成功消息
                     */
                    Ux.messageSuccess($combine);
                    /*
                     * 关闭窗口
                     */
                    Ex.rx(reference).close();
                })
            )
        } else {
            console.error("[ Ex ] 运行时错误，$selected 为空！");
        }
    } else {
        Ux.messageFailure($combine);
    }
}
const rxAdd = (reference) => (event) => {
    Ux.prevent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.push({key: Ux.randomUUID()});
    reference.setState({$data});
};
const rxRemove = (reference, key) => (event) => {
    Ux.prevent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data = $data.filter(item => key !== item.key);
    reference.setState({$data});
};
const rxChange = (reference, record) => (select) => {
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => record === item.key).forEach(each => {
        each.name = select; // 根据字段选择
        if (!each.hasOwnProperty('value')) {
            delete each.value;  // 清空值
        }
    });
    reference.setState({$data});
};
const rxInput = (reference, key) => (event) => {
    const text = Ux.ambEvent(event);
    let {$data = []} = reference.state;
    $data = Ux.clone($data);
    $data.filter(item => key === item.key).forEach(each => each.value = text);
    reference.setState({$data});
};
const yoTable = (reference) => {
    const {$columns = [], $data = []} = reference.state;
    const tables = {};
    tables.className = "web-table";
    tables.dataSource = $data;
    tables.columns = $columns;
    tables.pagination = false;
    return tables;
}
const yoButton = (reference) => {
    const buttons = {};
    const {$combine = {}} = reference.state;
    buttons.id = $combine.button;
    buttons.className = "ux-hidden";
    buttons.onClick = rxSubmit(reference);
    return buttons;
}
export default {
    rxAdd,
    rxRemove,
    rxChange,
    rxSubmit,
    rxInput,
    yoTable,
    yoButton,
}