import Ux from 'ux';
import U from 'underscore';
import Fx from '../Fx';

const init = (reference) => {
    const {$config = {}, $table = {}} = reference.props;
    let {full = {}, buttons = []} = $config;
    // 选中行处理，直接从表格列中读取
    let $selected = [];
    if ($table.columns) {
        $selected = $table.columns.map(column => column.dataIndex);
    }
    // 按钮专用处理
    const $buttons = Ux.clone(buttons);
    $buttons.forEach(item => {
        // 主要处理事件
        if ("RESET" === item.event) {
            // 重置列事件
            item.onClick = onSelected(reference, $selected);
        } else {
            // 事件触发专用
            item.onClick = Fx.rxColumn(reference);
        }
    });
    // full 处理
    const $options = Ux.RxAnt.toOptions(this, full);
    reference.setState({$options, $buttons, $selected});
};

const onSelected = (reference, defaultSelected) => ($selected) => {
    if (U.isArray($selected)) {
        reference.setState({$selected});
    } else {
        if (defaultSelected) {
            reference.setState({$selected: defaultSelected})
        } else {
            reference.setState({$selected});
        }
    }
};

export default {
    onSelected,
    init
}